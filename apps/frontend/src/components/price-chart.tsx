"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { TrendingUp } from "lucide-react"

// Mock historical data
const generateMockData = (days: number, basePrice: number) => {
  const data = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const randomChange = (Math.random() - 0.5) * 0.2 // ±10% random change
    const price = basePrice * (1 + randomChange * (i / days))

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number(price.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      timestamp: date.getTime(),
    })
  }

  return data.sort((a, b) => a.timestamp - b.timestamp)
}

const timeframes = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
]

interface PriceChartProps {
  pair: string
}

export function PriceChart({ pair }: PriceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(30)

  // Generate mock data based on pair
  const basePrice = pair === "TON/USDT" ? 5.42 : 0.1845
  const data = generateMockData(selectedTimeframe, basePrice)

  const currentPrice = data[data.length - 1]?.price || basePrice
  const previousPrice = data[0]?.price || basePrice
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100
  const isPositive = priceChange >= 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-bold font-mono">${payload[0].value.toFixed(4)}</p>
          <p className="text-sm text-muted-foreground">Volume: ${payload[0].payload.volume.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="surface-elevated border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {pair} Price Chart
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">${currentPrice.toFixed(4)}</span>
              <span className={`text-sm font-medium ${isPositive ? "crypto-green" : "crypto-red"}`}>
                {isPositive ? "+" : ""}
                {priceChange.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.label}
                variant={selectedTimeframe === timeframe.days ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.days)}
                className="text-xs"
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return selectedTimeframe <= 7
                    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Period High</span>
            <div className="font-mono font-semibold crypto-green">
              ${Math.max(...data.map((d) => d.price)).toFixed(4)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Period Low</span>
            <div className="font-mono font-semibold crypto-red">
              ${Math.min(...data.map((d) => d.price)).toFixed(4)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Avg Volume</span>
            <div className="font-mono font-semibold">
              ${Math.floor(data.reduce((sum, d) => sum + d.volume, 0) / data.length).toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Volatility</span>
            <div className="font-mono font-semibold">{Math.abs(priceChange).toFixed(2)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

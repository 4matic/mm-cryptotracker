import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PairHeaderProps {
  data: {
    pair: string
    baseSymbol: string
    quoteSymbol: string
    price: number
    change24h: number
    volume24h: number
    high24h: number
    low24h: number
    description: string
  }
}

export function PairHeader({ data }: PairHeaderProps) {
  const isPositive = data.change24h >= 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-balance">{data.pair}</h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-3xl">{data.description}</p>
      </div>

      <Card className="surface-elevated border-border/50">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold font-mono">${data.price.toFixed(4)}</span>
                <Badge variant={isPositive ? "default" : "destructive"} className="text-sm">
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {isPositive ? "+" : ""}
                  {data.change24h.toFixed(2)}%
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold font-mono">${data.volume24h.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="text-2xl font-bold font-mono crypto-green">${data.high24h.toFixed(4)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="text-2xl font-bold font-mono crypto-red">${data.low24h.toFixed(4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

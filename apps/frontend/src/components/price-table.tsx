"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, this would come from an API
const mockPrices = [
  {
    pair: "TON/USDT",
    price: 5.42,
    change24h: 2.34,
    volume24h: 1250000,
    high24h: 5.67,
    low24h: 5.12,
    slug: "ton-usdt",
  },
  {
    pair: "USDT/TON",
    price: 0.1845,
    change24h: -2.28,
    volume24h: 230000,
    high24h: 0.1953,
    low24h: 0.1763,
    slug: "usdt-ton",
  },
]

export function PriceTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {mockPrices.map((crypto) => (
          <Card key={crypto.pair} className="surface-elevated border-border/50 hover:surface-hover transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">{crypto.pair}</CardTitle>
                <Badge variant={crypto.change24h >= 0 ? "default" : "destructive"} className="text-sm">
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {crypto.change24h >= 0 ? "+" : ""}
                  {crypto.change24h.toFixed(2)}%
                </Badge>
              </div>
              <CardDescription>24h change and current price</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Price</span>
                  <span className="text-2xl font-bold font-mono">${crypto.price.toFixed(4)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">24h High</span>
                    <div className="font-mono crypto-green">${crypto.high24h.toFixed(4)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">24h Low</span>
                    <div className="font-mono crypto-red">${crypto.low24h.toFixed(4)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-mono">${crypto.volume24h.toLocaleString()}</span>
                </div>
              </div>

              <Link href={`/pair/${crypto.slug}`}>
                <Button className="w-full bg-transparent" variant="outline">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

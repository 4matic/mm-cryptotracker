import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PairStatsProps {
  data: {
    marketCap: number
    circulatingSupply: number
    allTimeHigh: number
    allTimeLow: number
    baseSymbol: string
    quoteSymbol: string
  }
}

export function PairStats({ data }: PairStatsProps) {
  return (
    <Card className="surface-elevated border-border/50">
      <CardHeader>
        <CardTitle>Market Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-mono font-semibold">${(data.marketCap / 1000000000).toFixed(2)}B</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Circulating Supply</span>
            <span className="font-mono font-semibold">
              {(data.circulatingSupply / 1000000000).toFixed(2)}B {data.baseSymbol}
            </span>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">All-Time High</span>
              <span className="font-mono font-semibold crypto-green">${data.allTimeHigh.toFixed(4)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">All-Time Low</span>
              <span className="font-mono font-semibold crypto-red">${data.allTimeLow.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import { Database, Calculator, TrendingUp, Shield, Clock, Globe } from "lucide-react"

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <BackButton />

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Data Methodology & Sources</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Comprehensive explanation of how we calculate cryptocurrency prices and ensure data accuracy
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="surface-elevated border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Primary Exchanges</span>
                    <Badge variant="secondary">Real-time</Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Binance - Largest global exchange</li>
                    <li>• OKX - High liquidity provider</li>
                    <li>• Bybit - Derivatives specialist</li>
                    <li>• Gate.io - Wide token coverage</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Data Aggregation</span>
                    <Badge variant="outline">Volume Weighted</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prices are calculated using volume-weighted average pricing (VWAP) across all connected exchanges to
                    ensure fair market representation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-elevated border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Price Calculation Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">TON/USDT</h4>
                    <p className="text-sm text-muted-foreground">
                      Direct trading pair available on major exchanges. Price calculated from real-time order book data.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">USDT/TON</h4>
                    <p className="text-sm text-muted-foreground">
                      Calculated as the mathematical inverse of TON/USDT (1 ÷ TON/USDT price) to maintain accuracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-elevated border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Market Data Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Update Frequency</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Every 30 seconds</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Global Coverage</span>
                    </div>
                    <p className="text-sm text-muted-foreground">24/7 monitoring</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Data Validation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Outlier detection</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Historical Data</span>
                    </div>
                    <p className="text-sm text-muted-foreground">1+ year retention</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-elevated border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Outlier Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated systems detect and filter price anomalies that deviate more than 5% from the median.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Exchange Reliability</h4>
                    <p className="text-sm text-muted-foreground">
                      Each exchange is weighted based on volume, uptime, and historical reliability metrics.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Fallback Systems</h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple redundant data sources ensure continuous service even if primary sources are unavailable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="surface-elevated border-border/50">
            <CardHeader>
              <CardTitle>Important Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Risk Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Cryptocurrency trading involves substantial risk and may not be suitable for all investors. Prices can
                  be extremely volatile and may be affected by external factors such as financial, regulatory, or
                  political events.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Data Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  While we strive for accuracy, cryptocurrency prices can change rapidly and there may be brief delays
                  in data updates. Always verify prices on the actual exchange before making trading decisions.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Not Financial Advice</h4>
                <p className="text-sm text-muted-foreground">
                  This platform provides market data for informational purposes only and should not be considered as
                  financial or investment advice. Always conduct your own research and consult with financial advisors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

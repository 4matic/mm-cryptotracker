import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { DataProvidersSection } from '@/components/data-providers-section';
import {
  Database,
  Calculator,
  Shield,
  Clock,
  TrendingUp,
  Zap,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <BackButton />

        <div className="space-y-12">
          <div className="text-center space-y-6 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Trusted Data Sources</span>
            </div>
            <h1 className="text-5xl font-bold text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Data Methodology & Sources
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-4xl mx-auto leading-relaxed">
              Comprehensive explanation of how we calculate cryptocurrency
              prices and ensure data accuracy through industry-leading
              methodologies
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Data Sources
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DataProvidersSection />
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Price Calculation Methods
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <div className="group/method p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 rounded-md bg-primary/20">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">
                        External Data Provider Integration
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Prices are fetched from established cryptocurrency data
                      providers that aggregate market data from multiple
                      exchanges to provide accurate pricing.
                    </p>
                  </div>

                  <div className="group/method p-4 bg-gradient-to-r from-accent/30 to-accent/40 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 rounded-md bg-primary/20">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">
                        Priority-Based System
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Multiple data providers are configured with priority
                      rankings. The system automatically uses the highest
                      priority provider available, with fallback to secondary
                      providers if needed.
                    </p>
                  </div>

                  <div className="group/method p-4 bg-gradient-to-r from-muted/40 to-muted/50 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 rounded-md bg-primary/20">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">
                        Scheduled Updates
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cryptocurrency prices are automatically fetched at regular
                      intervals and stored with timestamps. The system supports
                      conversion to multiple quote currencies (USD, EUR, etc.).
                    </p>
                  </div>

                  <div className="group/method p-4 bg-gradient-to-r from-secondary/30 to-secondary/40 rounded-lg border border-border/30 hover:border-border/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 rounded-md bg-primary/20">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground">
                        Trading Pair Management
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Active trading pairs are managed in the database, with
                      prices fetched for base assets and stored against their
                      corresponding quote assets to maintain historical price
                      records.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/15 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Important Disclaimers
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-lg p-5 border border-destructive/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Risk Warning
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cryptocurrency trading involves substantial risk and may not
                  be suitable for all investors. Prices can be extremely
                  volatile and may be affected by external factors such as
                  financial, regulatory, or political events.
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-5 border border-primary/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary/20">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Data Accuracy
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  While we strive for accuracy, cryptocurrency prices can change
                  rapidly and there may be brief delays in data updates. Always
                  verify prices on the actual exchange before making trading
                  decisions.
                </p>
              </div>

              <div className="bg-gradient-to-r from-accent/30 to-accent/40 rounded-lg p-5 border border-border/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Not Financial Advice
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This platform provides market data for informational purposes
                  only and should not be considered as financial or investment
                  advice. Always conduct your own research and consult with
                  financial advisors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

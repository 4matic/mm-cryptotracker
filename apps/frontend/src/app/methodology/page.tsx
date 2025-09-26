import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/back-button';
import { Database, Calculator } from 'lucide-react';
import { getDataProviders } from '@/lib/actions';
import type { DataProvider } from '@/graphql/GetDataProviders.gql';

export default async function MethodologyPage() {
  let dataProviders: DataProvider[] = [];

  try {
    dataProviders = await getDataProviders();
  } catch (error) {
    console.error('Failed to fetch data providers:', error);
    // Page will continue to render without the data providers section
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <BackButton />

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">
              Data Methodology & Sources
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Comprehensive explanation of how we calculate cryptocurrency
              prices and ensure data accuracy
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
                {dataProviders.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        External Data Providers
                      </span>
                      <Badge variant="secondary">Third-party</Badge>
                    </div>
                    <div className="space-y-3 ml-4">
                      {dataProviders.map((provider) => (
                        <div key={provider.name} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {provider.name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {provider.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={
                    dataProviders.length > 0
                      ? 'border-t border-border pt-4'
                      : ''
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Data Collection</span>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Price data is fetched from external providers at regular
                    intervals. These providers aggregate market data from
                    multiple exchanges on their end before delivering it to our
                    system.
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
                    <h4 className="font-semibold text-sm mb-2">
                      External Data Provider Integration
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Prices are fetched from established cryptocurrency data
                      providers that aggregate market data from multiple
                      exchanges to provide accurate pricing.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      Priority-Based System
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Multiple data providers are configured with priority
                      rankings. The system automatically uses the highest
                      priority provider available, with fallback to secondary
                      providers if needed.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      Scheduled Updates
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Cryptocurrency prices are automatically fetched at regular
                      intervals and stored with timestamps. The system supports
                      conversion to multiple quote currencies (USD, EUR, etc.).
                    </p>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      Trading Pair Management
                    </h4>
                    <p className="text-sm text-muted-foreground">
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

          <Card className="surface-elevated border-border/50">
            <CardHeader>
              <CardTitle>Important Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Risk Warning</h4>
                <p className="text-sm text-muted-foreground">
                  Cryptocurrency trading involves substantial risk and may not
                  be suitable for all investors. Prices can be extremely
                  volatile and may be affected by external factors such as
                  financial, regulatory, or political events.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Data Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  While we strive for accuracy, cryptocurrency prices can change
                  rapidly and there may be brief delays in data updates. Always
                  verify prices on the actual exchange before making trading
                  decisions.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Not Financial Advice</h4>
                <p className="text-sm text-muted-foreground">
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

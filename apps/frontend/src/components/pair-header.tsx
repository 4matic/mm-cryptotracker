import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3, Clock } from 'lucide-react';
import { AssetPrice } from '@/components/asset-price';
import { PairImage } from '@/components/pair-image';
import { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

interface PairHeaderProps {
  tradingPair: TradingPairModel;
  high24h?: number;
  low24h?: number;
  change24h?: number;
}

export function PairHeader({
  tradingPair,
  high24h = 0,
  low24h = 0,
  change24h = 0,
}: PairHeaderProps) {
  const isPositive = change24h >= 0;
  const hasChangeData = change24h !== 0;
  const hasHighLowData = high24h > 0 && low24h > 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 p-8">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <PairImage
                className="w-16 h-16 sm:w-20 sm:h-20"
                baseAsset={tradingPair.baseAsset}
                quoteAsset={tradingPair.quoteAsset}
              />
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-bold text-balance tracking-tight">
                  {tradingPair.symbol}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
                  {tradingPair.baseAsset.description ||
                    `${tradingPair.baseAsset.name} trading pair with ${tradingPair.quoteAsset.name}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Price and Stats Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Price Card - Takes more space */}
        <Card className="lg:col-span-2 border-border/50 bg-gradient-to-br from-card via-card to-card/80">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Current Price
                </h2>
                {tradingPair.calculatedPrice && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Price calculated at{' '}
                      {new Date(
                        tradingPair.calculatedPrice.timestamp
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="text-4xl sm:text-6xl font-bold font-mono tracking-tight">
                  <AssetPrice
                    calculatedPrice={tradingPair.calculatedPrice}
                    quoteAsset={tradingPair.quoteAsset}
                  />
                </div>

                {hasChangeData && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isPositive ? 'default' : 'destructive'}
                      className="text-base px-3 py-1.5 font-semibold"
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-2" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-2" />
                      )}
                      {isPositive ? '+' : ''}
                      {change24h.toFixed(2)}%
                    </Badge>
                    <span className="text-sm text-muted-foreground">24h</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">24h Statistics</h3>
              </div>

              <div className="space-y-4">
                {/* High/Low */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">High</p>
                    {hasHighLowData ? (
                      <p className="text-lg font-bold font-mono text-green-600 dark:text-green-400">
                        ${high24h.toFixed(4)}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
                        <span className="text-xs">N/A</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Low</p>
                    {hasHighLowData ? (
                      <p className="text-lg font-bold font-mono text-red-600 dark:text-red-400">
                        ${low24h.toFixed(4)}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
                        <span className="text-xs">N/A</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

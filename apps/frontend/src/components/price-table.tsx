import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';
import { PairImage } from './pair-image';
import { AssetPrice } from './asset-price';

interface PriceTableProps {
  tradingPairs: Pick<
    TradingPairModel,
    'id' | 'symbol' | 'quoteAsset' | 'calculatedPrice' | 'baseAsset' | 'slug'
  >[];
}

export function PriceTable({ tradingPairs }: PriceTableProps) {
  if (!tradingPairs || tradingPairs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No trading pairs available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {tradingPairs.map((pair) => (
          <Card
            key={pair.id}
            className="surface-elevated border-border/50 hover:surface-hover transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <PairImage
                    baseAsset={pair.baseAsset}
                    quoteAsset={pair.quoteAsset}
                  />
                  <CardTitle className="text-xl font-bold">
                    {pair.symbol}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <AssetPrice
                    calculatedPrice={pair.calculatedPrice}
                    quoteAsset={pair.quoteAsset}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link href={`/pair/${pair.slug}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

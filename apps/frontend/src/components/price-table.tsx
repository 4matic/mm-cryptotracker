import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

interface PriceTableProps {
  tradingPairs: Pick<
    TradingPairModel,
    'id' | 'symbol' | 'quoteAsset' | 'calculatedPrice' | 'baseAsset'
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
                  <div className="flex items-center -space-x-2 -space-y-2 -top-1 relative">
                    {pair.baseAsset.logoUrl && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-background border-2 z-10">
                        <Image
                          src={pair.baseAsset.logoUrl}
                          alt={pair.baseAsset.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {pair.quoteAsset.logoUrl && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-background border-2 opacity-70">
                        <Image
                          src={pair.quoteAsset.logoUrl}
                          alt={pair.quoteAsset.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {pair.symbol}
                  </CardTitle>
                </div>
                {pair.calculatedPrice && (
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {parseFloat(pair.calculatedPrice.price).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        }
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pair.quoteAsset.symbol}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button
                className="w-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link
                  href={`/pair/${pair.symbol.toLowerCase().replace('/', '-')}`}
                >
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

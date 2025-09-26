import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';
import { PairImage } from './pair-image';
import { AssetPrice } from './asset-price';

interface PriceTableProps {
  tradingPairs: TradingPairModel[];
}

export function PriceTable({ tradingPairs }: PriceTableProps) {
  if (!tradingPairs || tradingPairs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
            <ArrowRight className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground font-medium">
              No cryptocurrency pairs available
            </p>
            <p className="text-muted-foreground/70 text-sm">
              Check back later for updated market data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 justify-items-center max-w-4xl mx-auto">
        {tradingPairs.map((pair, index) => (
          <Card
            key={pair.id}
            className="group relative bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 w-full"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards',
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="pb-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <PairImage
                      baseAsset={pair.baseAsset}
                      quoteAsset={pair.quoteAsset}
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-chart-1/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-200">
                      {pair.symbol}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {pair.baseAsset.name} / {pair.quoteAsset.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <AssetPrice
                    calculatedPrice={pair.calculatedPrice}
                    quoteAsset={pair.quoteAsset}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 relative">
              <Button
                className="w-full bg-transparent hover:bg-primary/10 border-border/50 hover:border-primary/30 group-hover:shadow-md transition-all duration-200"
                variant="outline"
                asChild
              >
                <Link href={`/pair/${pair.slug}`}>
                  <span className="flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TradingPair } from '@/lib/types';

interface PriceTableProps {
  tradingPairs: TradingPair[];
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
                <CardTitle className="text-2xl font-bold">
                  {pair.symbol}
                </CardTitle>
              </div>
              <CardDescription>
                {pair.baseSymbol} / {pair.quoteSymbol}
              </CardDescription>
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

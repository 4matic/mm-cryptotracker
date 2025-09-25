import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AssetPrice } from '@/components/asset-price';
import { PairImage } from '@/components/pair-image';
interface PairHeaderProps {
  tradingPair: {
    id: string;
    symbol: string;
    slug: string;
    baseAsset: {
      symbol: string;
      name: string;
      description?: string;
      logoUrl?: string;
    };
    quoteAsset: {
      symbol: string;
      name: string;
      logoUrl?: string;
    };
    calculatedPrice?: {
      price: string;
      timestamp: Date;
      metadata?: Record<string, unknown>;
    } | null;
  };
  volume24h?: number;
  high24h?: number;
  low24h?: number;
  change24h?: number;
}

export function PairHeader({
  tradingPair,
  volume24h = 0,
  high24h = 0,
  low24h = 0,
  change24h = 0,
}: PairHeaderProps) {
  const isPositive = change24h >= 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <PairImage
            className="w-13 h-13"
            baseAsset={tradingPair.baseAsset}
            quoteAsset={tradingPair.quoteAsset}
          />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-balance">
              {tradingPair.symbol}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-3xl">
              {tradingPair.baseAsset.description ||
                `${tradingPair.baseAsset.name} trading pair`}
            </p>
          </div>
        </div>
      </div>

      <Card className="surface-elevated border-border/50">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold font-mono">
                  <AssetPrice
                    calculatedPrice={tradingPair.calculatedPrice}
                    quoteAsset={tradingPair.quoteAsset}
                  />
                </div>
                {change24h !== 0 && (
                  <Badge
                    variant={isPositive ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {isPositive ? '+' : ''}
                    {change24h.toFixed(2)}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold font-mono">
                {volume24h > 0 ? `$${volume24h.toLocaleString()}` : 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="text-2xl font-bold font-mono crypto-green">
                {high24h > 0 ? `$${high24h.toFixed(4)}` : 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="text-2xl font-bold font-mono crypto-red">
                {low24h > 0 ? `$${low24h.toFixed(4)}` : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

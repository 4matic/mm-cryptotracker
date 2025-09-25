import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface PairStatsProps {
  data: {
    marketCap: number;
    circulatingSupply: number;
    allTimeHigh: number;
    allTimeLow: number;
    baseSymbol: string;
    quoteSymbol: string;
  };
  disabled?: boolean;
}

export function PairStats({ data, disabled = false }: PairStatsProps) {
  return (
    <Card className="surface-elevated border-border/50 relative">
      {disabled && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 rounded-lg flex items-center justify-center">
          <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-6 shadow-lg max-w-sm mx-4 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Data Unavailable</h3>
            <p className="text-muted-foreground text-sm">
              Market statistics are temporarily unavailable. Please try again
              later.
            </p>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle>Market Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-mono font-semibold">
              {data.marketCap > 0
                ? `$${(data.marketCap / 1000000000).toFixed(2)}B`
                : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Circulating Supply
            </span>
            <span className="font-mono font-semibold">
              {data.circulatingSupply > 0
                ? `${(data.circulatingSupply / 1000000000).toFixed(2)}B ${
                    data.baseSymbol
                  }`
                : 'N/A'}
            </span>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                All-Time High
              </span>
              <span className="font-mono font-semibold crypto-green">
                {data.allTimeHigh > 0
                  ? `$${data.allTimeHigh.toFixed(4)}`
                  : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                All-Time Low
              </span>
              <span className="font-mono font-semibold crypto-red">
                {data.allTimeLow > 0 ? `$${data.allTimeLow.toFixed(4)}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

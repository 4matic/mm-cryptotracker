'use server';

import { PriceTable } from '@/components/price-table';
import { Info } from 'lucide-react';
import { getTradingPairs } from '@/lib/actions';
import { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

interface TradingPairsSectionProps {
  page?: number;
  limit?: number;
  isVisible?: boolean;
}

export async function TradingPairsSection({
  page = 1,
  limit = 20,
  isVisible = true,
}: TradingPairsSectionProps) {
  let tradingPairs: TradingPairModel[] = [];
  let error: string | null = null;

  try {
    const result = await getTradingPairs({
      page,
      limit,
      isVisible,
    });
    tradingPairs = result.pairs;
  } catch (err) {
    console.error('Failed to fetch trading pairs:', err);
    error = err instanceof Error ? err.message : 'Failed to load trading pairs';
    tradingPairs = [];
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
              <Info className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                Unable to load trading pairs
              </p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <p className="text-muted-foreground text-xs">
                Please ensure the backend server is running and try again
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {tradingPairs.length > 0 && (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Current Market Prices</h2>
            <p className="text-muted-foreground">
              {tradingPairs.length} cryptocurrency pairs available
            </p>
          </div>
          <PriceTable tradingPairs={tradingPairs} />
        </>
      )}
    </div>
  );
}

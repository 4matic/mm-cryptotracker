import { PriceTable } from '@/components/price-table';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { getTradingPairs } from '@/lib/actions';
import { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

export default async function HomePage() {
  let tradingPairs: TradingPairModel[] = [];
  let error: string | null = null;

  try {
    const result = await getTradingPairs({
      page: 1,
      limit: 20,
      isVisible: true,
    });
    tradingPairs = result.pairs;
  } catch (err) {
    console.error('Failed to fetch trading pairs:', err);
    error = err instanceof Error ? err.message : 'Failed to load trading pairs';
    tradingPairs = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">
              MM CryptoTracker
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Track cryptocurrency prices with detailed analysis and historical
              data
            </p>

            <div className="flex justify-center">
              <Link href="/methodology">
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent cursor-pointer"
                >
                  <Info className="h-4 w-4" />
                  View Data Methodology
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-center py-4">
              <p className="text-red-500 text-sm">
                Error loading trading pairs: {error}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Please check if the backend server is running
              </p>
            </div>
          )}

          <PriceTable tradingPairs={tradingPairs} />
        </div>
      </main>
    </div>
  );
}

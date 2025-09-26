import { notFound } from 'next/navigation';
import { PairHeader } from '@/components/pair-header';
import { PriceChart } from '@/components/price-chart';
import { PairStats } from '@/components/pair-stats';
import { DataProvider } from '@/components/data-provider';
import { BackButton } from '@/components/back-button';
import { getTradingPair } from '@/lib/actions';

// Helper function to extract additional stats that aren't in the core model
function getAdditionalStats(
  apiData: NonNullable<Awaited<ReturnType<typeof getTradingPair>>>
) {
  const currentPrice = apiData.calculatedPrice?.price
    ? parseFloat(apiData.calculatedPrice.price)
    : 0;

  return {
    change24h: 0, // TODO: This will need to be calculated from price history
    volume24h: 0, // TODO: This will need to come from additional data
    high24h: currentPrice, // TODO: This will need to be calculated from price history
    low24h: currentPrice, // TODO: This will need to be calculated from price history
    marketCap: 0, // TODO: This will need to come from additional data
    circulatingSupply: 0, // TODO: This will need to come from additional data
    allTimeHigh: currentPrice, // TODO: This will need to come from additional data
    allTimeLow: currentPrice, // TODO: This will need to come from additional data
    priceCalculation:
      typeof apiData.calculatedPrice?.metadata?.source === 'string'
        ? apiData.calculatedPrice.metadata.source
        : 'Calculated price from available data',
  };
}

interface PairPageProps {
  params: {
    slug: string;
  };
}

export default async function PairPage({ params }: PairPageProps) {
  try {
    const { slug } = await params;
    const tradingPair = await getTradingPair(slug);

    if (!tradingPair) {
      notFound();
    }

    const additionalStats = getAdditionalStats(tradingPair);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
        {/* Enhanced background decoration */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <BackButton />

          <div className="space-y-12 pt-4">
            <PairHeader
              tradingPair={tradingPair}
              change24h={additionalStats.change24h}
              high24h={additionalStats.high24h}
              low24h={additionalStats.low24h}
            />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <PriceChart pair={tradingPair.symbol} disabled={true} />
                <DataProvider
                  pair={tradingPair.symbol}
                  calculation={additionalStats.priceCalculation}
                />
              </div>

              <div className="space-y-6">
                <PairStats
                  data={{
                    baseSymbol: tradingPair.baseAsset.symbol,
                    quoteSymbol: tradingPair.quoteAsset.symbol,
                    marketCap: additionalStats.marketCap,
                    circulatingSupply: additionalStats.circulatingSupply,
                    allTimeHigh: additionalStats.allTimeHigh,
                    allTimeLow: additionalStats.allTimeLow,
                  }}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading trading pair:', error);
    notFound();
  }
}

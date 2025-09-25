import { notFound } from 'next/navigation';
import { PairHeader } from '@/components/pair-header';
import { PriceChart } from '@/components/price-chart';
import { PairStats } from '@/components/pair-stats';
import { DataProvider } from '@/components/data-provider';
import { BackButton } from '@/components/back-button';

// Mock data for different pairs
const pairData = {
  'ton-usdt': {
    pair: 'TON/USDT',
    baseSymbol: 'TON',
    quoteSymbol: 'USDT',
    price: 5.42,
    change24h: 2.34,
    volume24h: 1250000,
    high24h: 5.67,
    low24h: 5.12,
    marketCap: 18500000000,
    circulatingSupply: 3412000000,
    allTimeHigh: 8.24,
    allTimeLow: 0.52,
    description:
      'TON (The Open Network) is a decentralized blockchain platform originally developed by Telegram.',
    priceCalculation: 'Direct trading pair available on major exchanges',
  },
  'usdt-ton': {
    pair: 'USDT/TON',
    baseSymbol: 'USDT',
    quoteSymbol: 'TON',
    price: 0.1845,
    change24h: -2.28,
    volume24h: 230000,
    high24h: 0.1953,
    low24h: 0.1763,
    marketCap: 95000000000,
    circulatingSupply: 95000000000,
    allTimeHigh: 0.1953,
    allTimeLow: 0.1214,
    description:
      'USDT (Tether) is a stablecoin pegged to the US Dollar, widely used for trading.',
    priceCalculation:
      'Calculated as inverse of TON/USDT pair (1 ÷ TON/USDT price)',
  },
};

interface PairPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return [{ slug: 'ton-usdt' }, { slug: 'usdt-ton' }];
}

export default function PairPage({ params }: PairPageProps) {
  const data = pairData[params.slug as keyof typeof pairData];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <BackButton />

        <div className="space-y-8">
          <PairHeader data={data} />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <PriceChart pair={data.pair} disabled={true} />
              <DataProvider
                pair={data.pair}
                calculation={data.priceCalculation}
              />
            </div>

            <div className="space-y-6">
              <PairStats data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

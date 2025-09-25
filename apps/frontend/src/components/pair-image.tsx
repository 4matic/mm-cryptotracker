import Image from 'next/image';
import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

interface PairImageProps {
  baseAsset: Pick<TradingPairModel['baseAsset'], 'logoUrl' | 'name'>;
  quoteAsset: Pick<TradingPairModel['quoteAsset'], 'logoUrl' | 'name'>;
}

export function PairImage({ baseAsset, quoteAsset }: PairImageProps) {
  return (
    <div className="flex items-center -space-x-2 -space-y-2 -top-1 relative">
      {baseAsset.logoUrl && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-background border-2 z-10">
          <Image
            src={baseAsset.logoUrl}
            alt={baseAsset.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      {quoteAsset.logoUrl && (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-background border-2 opacity-70">
          <Image
            src={quoteAsset.logoUrl}
            alt={quoteAsset.name}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

import clsx from 'clsx';
import Image from 'next/image';

interface PairImageProps {
  className?: string;
  baseAsset: {
    logoUrl?: string;
    name: string;
  };
  quoteAsset: {
    logoUrl?: string;
    name: string;
  };
}

export function PairImage({
  baseAsset,
  quoteAsset,
  className = 'w-8 h-8',
}: PairImageProps) {
  return (
    <div className="flex items-center -space-x-2 -space-y-2 -top-1 relative">
      {baseAsset.logoUrl && (
        <div
          className={clsx(
            'relative rounded-full overflow-hidden border-background border-2 z-10',
            className
          )}
        >
          <Image
            src={baseAsset.logoUrl}
            alt={baseAsset.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      {quoteAsset.logoUrl && (
        <div
          className={clsx(
            'relative rounded-full overflow-hidden border-background border-2 opacity-70',
            className
          )}
        >
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

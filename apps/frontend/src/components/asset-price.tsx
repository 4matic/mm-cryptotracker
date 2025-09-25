import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

interface AssetPriceProps {
  calculatedPrice: TradingPairModel['calculatedPrice'];
  quoteAsset: Pick<TradingPairModel['quoteAsset'], 'symbol'>;
}

export function AssetPrice({ calculatedPrice, quoteAsset }: AssetPriceProps) {
  if (calculatedPrice) {
    return (
      <>
        <div className="text-2xl font-bold">
          {parseFloat(calculatedPrice.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}
        </div>
        <div className="text-sm text-muted-foreground">{quoteAsset.symbol}</div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-1">
      <div className="text-lg font-medium text-muted-foreground/70 bg-muted/30 px-3 py-1.5 rounded-lg border border-dashed border-muted-foreground/30">
        Price Unavailable
      </div>
      {/* <div className="text-xs text-muted-foreground/60 flex items-center space-x-1">
        <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse"></div>
        <span>Fetching data...</span>
      </div> */}
    </div>
  );
}

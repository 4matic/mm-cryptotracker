import { EntityRepository } from '@mikro-orm/postgresql';
import type {
  FilterQuery,
  FindOneOptions,
  FindOptions,
  Loaded,
} from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { transformAssetUrl } from '@/helpers/asset-url.helper';

/**
 * Custom repository for TradingPair entity with asset URL transformation
 */
export class TradingPairRepository extends EntityRepository<TradingPair> {
  /**
   * Transforms asset logoUrl for both base and quote assets in a trading pair
   */
  private transformTradingPair<T>(tradingPair: T): T {
    console.log('transformTradingPair');
    if (tradingPair && typeof tradingPair === 'object') {
      const transformed = { ...tradingPair };
      const pair = transformed as T & {
        baseAsset?: { logoUrl?: string };
        quoteAsset?: { logoUrl?: string };
      };

      // Transform base asset logo URL
      if (pair.baseAsset && pair.baseAsset.logoUrl) {
        pair.baseAsset = {
          ...pair.baseAsset,
          logoUrl: transformAssetUrl(pair.baseAsset.logoUrl),
        };
      }

      // Transform quote asset logo URL
      if (pair.quoteAsset && pair.quoteAsset.logoUrl) {
        pair.quoteAsset = {
          ...pair.quoteAsset,
          logoUrl: transformAssetUrl(pair.quoteAsset.logoUrl),
        };
      }

      return transformed;
    }
    return tradingPair;
  }

  /**
   * Transforms array of trading pairs with asset URL transformation
   */
  private transformTradingPairs<T>(tradingPairs: T[]): T[] {
    console.log('transformTradingPairs');
    return tradingPairs.map((pair) => this.transformTradingPair(pair));
  }

  /**
   * Find one trading pair with URL transformation
   */
  override async findOne<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<TradingPair>,
    options?: FindOneOptions<TradingPair, Hint, Fields, Excludes>
  ): Promise<Loaded<TradingPair, Hint, Fields, Excludes> | null> {
    const tradingPair = await super.findOne(where, options);
    return tradingPair ? this.transformTradingPair(tradingPair) : tradingPair;
  }

  /**
   * Find multiple trading pairs with URL transformation
   */
  override async find<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<TradingPair>,
    options?: FindOptions<TradingPair, Hint, Fields, Excludes>
  ): Promise<Loaded<TradingPair, Hint, Fields, Excludes>[]> {
    const tradingPairs = await super.find(where, options);
    return this.transformTradingPairs(tradingPairs);
  }

  /**
   * Find and count trading pairs with URL transformation
   */
  override async findAndCount<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<TradingPair>,
    options?: FindOptions<TradingPair, Hint, Fields, Excludes>
  ): Promise<[Loaded<TradingPair, Hint, Fields, Excludes>[], number]> {
    const [tradingPairs, count] = await super.findAndCount(where, options);
    return [this.transformTradingPairs(tradingPairs), count];
  }
}

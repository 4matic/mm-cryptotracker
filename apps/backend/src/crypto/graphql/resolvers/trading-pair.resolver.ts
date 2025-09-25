import {
  Resolver,
  Query,
  Args,
  ID,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TradingPairService } from '@/crypto/services/trading-pair.service';
import { PriceHistoryService } from '@/crypto/services/price-history.service';
import { PriceCalculationService } from '@/crypto/services/price-calculation.service';
import { TradingPairModel } from '@mm-cryptotracker/shared-graphql';
import { AssetModel } from '@mm-cryptotracker/shared-graphql';
import { PriceHistoryModel } from '@mm-cryptotracker/shared-graphql';
import { TradingPair } from '@/entities/trading-pair.entity';
import { PriceHistory } from '@/entities/price-history.entity';
import { PaginatedTradingPairsModel } from '@mm-cryptotracker/shared-graphql';
import { AddAssetUrl } from '@/decorators';

/**
 * GraphQL resolver for TradingPair entity
 */
@Resolver(() => TradingPairModel)
export class TradingPairResolver {
  constructor(
    private readonly tradingPairService: TradingPairService,
    private readonly priceHistoryService: PriceHistoryService,
    private readonly priceCalculationService: PriceCalculationService
  ) {}

  @Query(() => [TradingPairModel])
  async tradingPairs(): Promise<TradingPair[]> {
    return this.tradingPairService.findAllActive();
  }

  @Query(() => TradingPairModel, { nullable: true })
  async tradingPair(
    @Args('id', { type: () => ID }) id: number
  ): Promise<TradingPair | null> {
    return this.tradingPairService.findById(id);
  }

  @Query(() => TradingPairModel, { nullable: true })
  async tradingPairBySymbol(
    @Args('symbol') symbol: string
  ): Promise<TradingPair | null> {
    return this.tradingPairService.findBySymbol(symbol);
  }

  @Query(() => PaginatedTradingPairsModel)
  async tradingPairsWithPagination(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('isVisible', { type: () => Boolean, nullable: true })
    isVisible?: boolean
  ): Promise<PaginatedTradingPairsModel> {
    const result = await this.tradingPairService.findWithPagination(
      page,
      limit,
      isVisible
    );
    return { ...result, page, limit };
  }

  @AddAssetUrl()
  @ResolveField(() => AssetModel)
  async baseAsset(@Parent() tradingPair: TradingPair): Promise<AssetModel> {
    // The baseAsset should already be populated if the service is called correctly
    return tradingPair.baseAsset;
  }

  @AddAssetUrl()
  @ResolveField(() => AssetModel)
  async quoteAsset(@Parent() tradingPair: TradingPair): Promise<AssetModel> {
    // The quoteAsset should already be populated if the service is called correctly
    return tradingPair.quoteAsset;
  }

  @ResolveField(() => PriceHistoryModel, { nullable: true })
  async latestPrice(
    @Parent() tradingPair: TradingPair
  ): Promise<PriceHistory | null> {
    return this.priceHistoryService.getLatestPrice(tradingPair.id);
  }

  @ResolveField(() => PriceHistoryModel, { nullable: true })
  async calculatedPrice(
    @Parent() tradingPair: TradingPair
  ): Promise<PriceHistory | null> {
    // First check if latestPrice exists
    const latestPrice = await this.priceHistoryService.getLatestPrice(
      tradingPair.id
    );

    // If latestPrice exists, return null (no calculation needed)
    if (latestPrice) {
      return null;
    }

    // If no latestPrice, calculate using smart algorithm
    return this.priceCalculationService.calculateIndirectPrice(tradingPair);
  }
}

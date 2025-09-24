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
import { TradingPairModel } from '@/crypto/graphql/models/trading-pair.model';
import { AssetModel } from '@/crypto/graphql/models/asset.model';
import { TradingPair } from '@/entities/trading-pair.entity';

/**
 * GraphQL resolver for TradingPair entity
 */
@Resolver(() => TradingPairModel)
export class TradingPairResolver {
  constructor(private readonly tradingPairService: TradingPairService) {}

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

  @Query(() => [TradingPairModel])
  async tradingPairsWithPagination(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('isVisible', { type: () => Boolean, nullable: true })
    isVisible?: boolean
  ): Promise<TradingPair[]> {
    const result = await this.tradingPairService.findWithPagination(
      page,
      limit,
      isVisible
    );
    return result.pairs;
  }

  @ResolveField(() => AssetModel)
  async baseAsset(@Parent() tradingPair: TradingPair): Promise<AssetModel> {
    // The baseAsset should already be populated if the service is called correctly
    return tradingPair.baseAsset;
  }

  @ResolveField(() => AssetModel)
  async quoteAsset(@Parent() tradingPair: TradingPair): Promise<AssetModel> {
    // The quoteAsset should already be populated if the service is called correctly
    return tradingPair.quoteAsset;
  }
}

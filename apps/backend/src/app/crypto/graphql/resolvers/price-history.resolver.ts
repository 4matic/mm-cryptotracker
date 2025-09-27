import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PriceHistoryService } from '@/app/crypto/services/price-history.service';
import { PriceHistoryModel } from '@mm-cryptotracker/shared-graphql';
import { TradingPairModel } from '@mm-cryptotracker/shared-graphql';
import { DataProviderModel } from '@mm-cryptotracker/shared-graphql';
import { PriceHistory } from '@/app/crypto/entities/price-history.entity';

/**
 * GraphQL resolver for PriceHistory entity
 */
@Resolver(() => PriceHistoryModel)
export class PriceHistoryResolver {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Query(() => [PriceHistoryModel])
  async priceHistories(
    @Args('tradingPairId', { type: () => Int, nullable: true })
    tradingPairId?: number,
    @Args('dataProviderId', { type: () => Int, nullable: true })
    dataProviderId?: number,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
    @Args('limit', { type: () => Int, defaultValue: 100 }) limit?: number
  ): Promise<PriceHistory[]> {
    return this.priceHistoryService.findPriceHistory({
      tradingPairId,
      dataProviderId,
      startDate,
      endDate,
      limit,
    });
  }

  @Query(() => PriceHistoryModel, { nullable: true })
  async latestPrice(
    @Args('tradingPairId', { type: () => Int }) tradingPairId: number,
    @Args('dataProviderId', { type: () => Int, nullable: true })
    dataProviderId?: number
  ): Promise<PriceHistory | null> {
    return this.priceHistoryService.getLatestPrice(
      tradingPairId,
      dataProviderId
    );
  }

  @Query(() => [PriceHistoryModel])
  async chartData(
    @Args('tradingPairId', { type: () => Int }) tradingPairId: number,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
    @Args('dataProviderId', { type: () => Int, nullable: true })
    dataProviderId?: number
  ): Promise<PriceHistory[]> {
    return this.priceHistoryService.getChartData(
      tradingPairId,
      startDate,
      endDate,
      dataProviderId
    );
  }

  @ResolveField(() => TradingPairModel)
  async tradingPair(
    @Parent() priceHistory: PriceHistory
  ): Promise<TradingPairModel> {
    // The tradingPair should already be populated by the service
    return priceHistory.tradingPair;
  }

  @ResolveField(() => DataProviderModel)
  async dataProvider(
    @Parent() priceHistory: PriceHistory
  ): Promise<DataProviderModel> {
    // The dataProvider should already be populated by the service
    return priceHistory.dataProvider;
  }
}

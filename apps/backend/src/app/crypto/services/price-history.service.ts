import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  EnsureRequestContext,
} from '@mikro-orm/core';
import { PriceHistory } from '@/entities/price-history.entity';
import { TradingPair } from '@/entities/trading-pair.entity';
import { DataProvider } from '@/entities/data-provider.entity';

export interface PriceHistoryQuery {
  tradingPairId?: number;
  dataProviderId?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

/**
 * Service for managing price history data
 */
@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: EntityRepository<PriceHistory>,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: EntityRepository<TradingPair>,
    @InjectRepository(DataProvider)
    private readonly dataProviderRepository: EntityRepository<DataProvider>,
    private readonly em: EntityManager
  ) {}

  /**
   * Creates a new price history entry
   */
  async createPriceHistory(
    tradingPairId: number,
    dataProviderId: number,
    timestamp: Date,
    price: string
  ): Promise<PriceHistory | null> {
    const tradingPair = await this.tradingPairRepository.findOne(tradingPairId);
    const dataProvider = await this.dataProviderRepository.findOne(
      dataProviderId
    );

    if (!tradingPair || !dataProvider) {
      return null;
    }

    const existingEntry = await this.priceHistoryRepository.findOne({
      tradingPair,
      dataProvider,
      timestamp,
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.updatePrice(price);
      await this.em.flush();
      return existingEntry;
    }

    const priceHistory = new PriceHistory(
      tradingPair,
      dataProvider,
      timestamp,
      price
    );

    await this.em.persistAndFlush(priceHistory);
    return priceHistory;
  }

  /**
   * Gets price history with filtering options
   */
  async findPriceHistory(query: PriceHistoryQuery): Promise<PriceHistory[]> {
    const where: Record<string, unknown> = {};

    if (query.tradingPairId) {
      where.tradingPair = query.tradingPairId;
    }

    if (query.dataProviderId) {
      where.dataProvider = query.dataProviderId;
    }

    if (query.startDate || query.endDate) {
      const timestampCondition: Record<string, Date> = {};
      if (query.startDate) timestampCondition.$gte = query.startDate;
      if (query.endDate) timestampCondition.$lte = query.endDate;
      where.timestamp = timestampCondition;
    }

    return this.priceHistoryRepository.find(where, {
      populate: [
        'tradingPair.baseAsset',
        'tradingPair.quoteAsset',
        'dataProvider',
      ],
      orderBy: { timestamp: 'DESC' },
      limit: query.limit || 100,
    });
  }

  /**
   * Gets the latest price for a trading pair
   */
  @EnsureRequestContext()
  async getLatestPrice(
    tradingPairId: number,
    dataProviderId?: number
  ): Promise<PriceHistory | null> {
    const where: Record<string, unknown> = { tradingPair: tradingPairId };
    if (dataProviderId) {
      where.dataProvider = dataProviderId;
    }

    return this.priceHistoryRepository.findOne(where, {
      populate: [
        'tradingPair.baseAsset',
        'tradingPair.quoteAsset',
        'dataProvider',
      ],
      orderBy: { timestamp: 'DESC' },
    });
  }

  /**
   * Gets price history for chart data
   */
  async getChartData(
    tradingPairId: number,
    startDate: Date,
    endDate: Date,
    dataProviderId?: number
  ): Promise<PriceHistory[]> {
    const where: Record<string, unknown> = {
      tradingPair: tradingPairId,
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (dataProviderId) {
      where.dataProvider = dataProviderId;
    }

    return this.priceHistoryRepository.find(where, {
      orderBy: { timestamp: 'ASC' },
    });
  }

  /**
   * Calculates price statistics for a time period
   */
  async getPriceStatistics(
    tradingPairId: number,
    startDate: Date,
    endDate: Date,
    dataProviderId?: number
  ): Promise<{
    high: string;
    low: string;
    first: string;
    last: string;
    count: number;
  } | null> {
    const where: Record<string, unknown> = {
      tradingPair: tradingPairId,
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (dataProviderId) {
      where.dataProvider = dataProviderId;
    }

    const priceData = await this.priceHistoryRepository.find(where, {
      orderBy: { timestamp: 'ASC' },
    });

    if (priceData.length === 0) {
      return null;
    }

    const prices = priceData.map((p) => parseFloat(p.price));
    const high = Math.max(...prices).toString();
    const low = Math.min(...prices).toString();
    const first = priceData[0].price;
    const last = priceData[priceData.length - 1].price;

    return {
      high,
      low,
      first,
      last,
      count: priceData.length,
    };
  }

  /**
   * Updates price for a specific trading pair and data provider
   */
  async updatePrice(
    tradingPairId: number,
    dataProviderId: number,
    price: string
  ): Promise<PriceHistory> {
    const tradingPair = await this.tradingPairRepository.findOne(tradingPairId);
    const dataProvider = await this.dataProviderRepository.findOne(
      dataProviderId
    );

    if (!tradingPair || !dataProvider) {
      throw new Error('Trading pair or data provider not found');
    }

    const timestamp = new Date();
    const priceHistory = new PriceHistory(
      tradingPair,
      dataProvider,
      timestamp,
      price
    );

    await this.em.persistAndFlush(priceHistory);
    return priceHistory;
  }
}

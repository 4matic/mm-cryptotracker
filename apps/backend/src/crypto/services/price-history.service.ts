import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { PriceHistory, TimeInterval } from '@/entities/price-history.entity';
import { TradingPair } from '@/entities/trading-pair.entity';
import { DataProvider } from '@/entities/data-provider.entity';

export interface PriceHistoryQuery {
  tradingPairId?: number;
  dataProviderId?: number;
  interval?: TimeInterval;
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
    openPrice: string,
    highPrice: string,
    lowPrice: string,
    closePrice: string,
    interval: TimeInterval = TimeInterval.ONE_HOUR,
    volume?: string,
    volumeQuote?: string,
    tradesCount?: number
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
      interval,
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.openPrice = openPrice;
      existingEntry.highPrice = highPrice;
      existingEntry.lowPrice = lowPrice;
      existingEntry.closePrice = closePrice;
      existingEntry.volume = volume;
      existingEntry.volumeQuote = volumeQuote;
      existingEntry.tradesCount = tradesCount;
      await this.em.flush();
      return existingEntry;
    }

    const priceHistory = new PriceHistory(
      tradingPair,
      dataProvider,
      timestamp,
      openPrice,
      highPrice,
      lowPrice,
      closePrice,
      interval
    );

    if (volume) priceHistory.volume = volume;
    if (volumeQuote) priceHistory.volumeQuote = volumeQuote;
    if (tradesCount) priceHistory.tradesCount = tradesCount;

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

    if (query.interval) {
      where.interval = query.interval;
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
    interval: TimeInterval,
    startDate: Date,
    endDate: Date,
    dataProviderId?: number
  ): Promise<PriceHistory[]> {
    const where: Record<string, unknown> = {
      tradingPair: tradingPairId,
      interval,
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
    open: string;
    close: string;
    volume: string;
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

    const high = Math.max(
      ...priceData.map((p) => parseFloat(p.highPrice))
    ).toString();
    const low = Math.min(
      ...priceData.map((p) => parseFloat(p.lowPrice))
    ).toString();
    const open = priceData[0].openPrice;
    const close = priceData[priceData.length - 1].closePrice;
    const volume = priceData
      .reduce((sum, p) => sum + parseFloat(p.volume || '0'), 0)
      .toString();

    return {
      high,
      low,
      open,
      close,
      volume,
      count: priceData.length,
    };
  }
}

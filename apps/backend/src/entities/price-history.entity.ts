import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  Unique,
  Enum,
} from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { DataProvider } from '@/entities/data-provider.entity';

export enum TimeInterval {
  ONE_MINUTE = '1m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  ONE_HOUR = '1h',
  FOUR_HOURS = '4h',
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
}

/**
 * Represents historical price data for a trading pair from a specific data provider
 */
@Entity()
@Unique({
  properties: ['tradingPair', 'dataProvider', 'timestamp', 'interval'],
})
@Index({ properties: ['tradingPair', 'timestamp'] })
@Index({ properties: ['dataProvider', 'timestamp'] })
export class PriceHistory {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => TradingPair)
  tradingPair!: TradingPair;

  @ManyToOne(() => DataProvider)
  dataProvider!: DataProvider;

  @Property({ type: 'timestamp' })
  @Index()
  timestamp!: Date;

  @Enum(() => TimeInterval)
  interval: TimeInterval = TimeInterval.ONE_HOUR;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  openPrice!: string;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  highPrice!: string;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  lowPrice!: string;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  closePrice!: string;

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume?: string;

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volumeQuote?: string;

  @Property({ type: 'integer', nullable: true })
  tradesCount?: number;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  constructor(
    tradingPair: TradingPair,
    dataProvider: DataProvider,
    timestamp: Date,
    openPrice: string,
    highPrice: string,
    lowPrice: string,
    closePrice: string,
    interval: TimeInterval = TimeInterval.ONE_HOUR
  ) {
    this.tradingPair = tradingPair;
    this.dataProvider = dataProvider;
    this.timestamp = timestamp;
    this.openPrice = openPrice;
    this.highPrice = highPrice;
    this.lowPrice = lowPrice;
    this.closePrice = closePrice;
    this.interval = interval;
  }

  /**
   * Checks if this price data represents a bullish candle
   */
  isBullish(): boolean {
    return parseFloat(this.closePrice) > parseFloat(this.openPrice);
  }

  /**
   * Calculates the price change for this period
   */
  getPriceChange(): number {
    return parseFloat(this.closePrice) - parseFloat(this.openPrice);
  }

  /**
   * Calculates the price change percentage for this period
   */
  getPriceChangePercentage(): number {
    const openPrice = parseFloat(this.openPrice);
    const closePrice = parseFloat(this.closePrice);
    return ((closePrice - openPrice) / openPrice) * 100;
  }
}

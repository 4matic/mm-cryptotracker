import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  Unique,
} from '@mikro-orm/core';
import { TradingPair } from './trading-pair.entity';
import { DataProvider } from './data-provider.entity';

/**
 * Represents current price data for a trading pair from a specific data provider
 */
@Entity()
@Unique({
  properties: ['tradingPair', 'dataProvider', 'timestamp'],
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

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  price!: string;

  @Property({ type: 'timestamp', nullable: true })
  lastUpdated?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  constructor(
    tradingPair: TradingPair,
    dataProvider: DataProvider,
    timestamp: Date,
    price: string
  ) {
    this.tradingPair = tradingPair;
    this.dataProvider = dataProvider;
    this.timestamp = timestamp;
    this.price = price;
    this.lastUpdated = timestamp;
  }

  /**
   * Updates the price
   */
  updatePrice(price: string): void {
    this.price = price;
    this.lastUpdated = new Date();
  }
}

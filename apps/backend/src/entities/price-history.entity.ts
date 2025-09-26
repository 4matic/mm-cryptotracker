import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  Unique,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { TradingPair } from './trading-pair.entity';
import { DataProvider } from './data-provider.entity';
import { PriceHistoryRepository } from '@/repositories/price-history.repository';

/**
 * Represents current price data for a trading pair from a specific data provider
 */
@Entity({ repository: () => PriceHistoryRepository })
@Unique({
  properties: ['tradingPair', 'dataProvider', 'timestamp'],
})
@Index({ properties: ['tradingPair', 'timestamp'] })
@Index({ properties: ['dataProvider', 'timestamp'] })
export class PriceHistory {
  [EntityRepositoryType]?: PriceHistoryRepository;
  @ApiProperty({
    description: 'Unique identifier for the price history entry',
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'Trading pair associated with this price entry',
    type: () => TradingPair,
  })
  @ManyToOne(() => TradingPair)
  tradingPair!: TradingPair;

  @ApiProperty({
    description: 'Data provider that supplied this price',
    type: () => DataProvider,
  })
  @ManyToOne(() => DataProvider)
  dataProvider!: DataProvider;

  @ApiProperty({
    description: 'Timestamp when the price was recorded',
    example: '2024-01-01T12:00:00.000Z',
  })
  @Property({ type: 'timestamp' })
  @Index()
  timestamp!: Date;

  @ApiProperty({
    description: 'Price value as decimal string for precision',
    example: '45000.12345678',
  })
  @Property({ type: 'decimal', precision: 20, scale: 8 })
  price!: string;

  @ApiProperty({
    description: 'Last time this price entry was updated',
    example: '2024-01-01T12:00:00.000Z',
    required: false,
  })
  @Property({ type: 'timestamp', nullable: true })
  lastUpdated?: Date;

  @ApiProperty({
    description: 'Additional metadata for the price entry',
    example: { volume: '1000.0', high: '45100.0', low: '44900.0' },
    required: false,
  })
  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Price history entry creation timestamp',
    example: '2024-01-01T12:00:00.000Z',
  })
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

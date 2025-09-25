import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { PriceHistory } from './price-history.entity';

/**
 * Represents a data provider for cryptocurrency prices
 * Examples: Binance, CoinGecko, CoinMarketCap, etc.
 */
@Entity()
export class DataProvider {
  @ApiProperty({
    description: 'Unique identifier for the data provider',
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'URL-friendly slug for the data provider',
    example: 'binance',
  })
  @Property({ unique: true })
  slug!: string;

  @ApiProperty({
    description: 'Display name of the data provider',
    example: 'Binance',
  })
  @Property({ unique: true })
  name!: string;

  @ApiProperty({
    description: 'Description of the data provider',
    example: 'Major cryptocurrency exchange providing real-time price data',
    required: false,
  })
  @Property({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'API URL for the data provider',
    example: 'https://api.binance.com',
    required: false,
  })
  @Property({ nullable: true })
  apiUrl?: string;

  @ApiProperty({
    description: 'Official website URL',
    example: 'https://binance.com',
    required: false,
  })
  @Property({ nullable: true })
  website?: string;

  @ApiProperty({
    description: 'API configuration and settings',
    example: { apiKey: 'xxx', timeout: 5000 },
    required: false,
  })
  @Property({ type: 'json', nullable: true })
  apiConfig?: Record<string, unknown>;

  @ApiProperty({
    description: 'Whether the data provider is active',
    example: true,
  })
  @Property({ type: 'boolean', default: true })
  isActive = true;

  @ApiProperty({
    description: 'Rate limit for API calls per minute',
    example: 30,
  })
  @Property({ type: 'integer', default: 30 })
  rateLimitPerMinute = 30;

  @ApiProperty({
    description: 'Priority level for data provider (higher = more priority)',
    example: 1,
  })
  @Property({ type: 'integer', default: 1 })
  priority = 1;

  @ApiProperty({
    description: 'Data provider creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Data provider last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => PriceHistory, 'dataProvider')
  priceHistories = new Collection<PriceHistory>(this);

  constructor(slug: string, name: string, description?: string) {
    this.slug = slug;
    this.name = name;
    this.description = description;
  }
}

import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Asset } from './asset.entity';
import { PriceHistory } from './price-history.entity';
import { TradingPairRepository } from '@/repositories/trading-pair.repository';

/**
 * Represents a trading pair (e.g., BTC/USD, ETH/BTC)
 */
@Entity({ repository: () => TradingPairRepository })
@Unique({ properties: ['baseAsset', 'quoteAsset'] })
export class TradingPair {
  [EntityRepositoryType]?: TradingPairRepository;

  @ApiProperty({
    description: 'Unique identifier for the trading pair',
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'Base asset of the trading pair',
    type: () => Asset,
  })
  @ManyToOne(() => Asset)
  baseAsset!: Asset;

  @ApiProperty({
    description: 'Quote asset of the trading pair',
    type: () => Asset,
  })
  @ManyToOne(() => Asset)
  quoteAsset!: Asset;

  @ApiProperty({
    description: 'Trading pair symbol (e.g., BTC/USD)',
    example: 'BTC/USD',
  })
  @Property({ unique: true })
  symbol!: string;

  @ApiProperty({
    description: 'URL-friendly slug for the trading pair',
    example: 'btc-usd',
  })
  @Property({ unique: true })
  slug!: string;

  @ApiProperty({
    description: 'Whether the trading pair is active',
    example: true,
  })
  @Property({ type: 'boolean', default: true })
  isActive = true;

  @ApiProperty({
    description: 'Whether the trading pair is visible to users',
    example: false,
  })
  @Property({ type: 'boolean', default: false })
  isVisible = false;

  @ApiProperty({
    description: 'Trading pair creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Trading pair last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => PriceHistory, 'tradingPair')
  priceHistories = new Collection<PriceHistory>(this);

  constructor(baseAsset: Asset, quoteAsset: Asset) {
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.symbol = `${baseAsset.symbol}/${quoteAsset.symbol}`;
    this.slug = `${baseAsset.symbol.toLowerCase()}-${quoteAsset.symbol.toLowerCase()}`;
  }
}

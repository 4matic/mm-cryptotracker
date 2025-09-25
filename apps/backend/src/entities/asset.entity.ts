import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { TradingPair } from '@/entities/trading-pair.entity';
import { AssetRepository } from '@/repositories/asset.repository';

/**
 * Represents a cryptocurrency or trading asset
 */
@Entity({ repository: () => AssetRepository })
export class Asset {
  [EntityRepositoryType]?: AssetRepository;

  @ApiProperty({
    description: 'Unique identifier for the asset',
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'Asset symbol (e.g., BTC, ETH)',
    example: 'BTC',
  })
  @Property({ unique: true })
  symbol!: string;

  @ApiProperty({
    description: 'Full name of the asset',
    example: 'Bitcoin',
  })
  @Property()
  name!: string;

  @ApiProperty({
    description: 'Description of the asset',
    example: 'A decentralized digital currency',
    required: false,
  })
  @Property({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'URL to the asset logo',
    example: 'https://example.com/btc-logo.png',
    required: false,
  })
  @Property({ nullable: true })
  logoUrl?: string;

  @ApiProperty({
    description: 'Official website URL',
    example: 'https://bitcoin.org',
    required: false,
  })
  @Property({ nullable: true })
  website?: string;

  @ApiProperty({
    description: 'Whether the asset is active for trading',
    example: true,
  })
  @Property({ type: 'boolean', default: true })
  isActive = true;

  @ApiProperty({
    description: 'Whether the asset is a fiat currency',
    example: false,
  })
  @Property({ type: 'boolean', default: false })
  isFiat = false;

  @ApiProperty({
    description: 'Asset creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Asset last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => TradingPair, 'baseAsset')
  basePairs = new Collection<TradingPair>(this);

  @OneToMany(() => TradingPair, 'quoteAsset')
  quotePairs = new Collection<TradingPair>(this);

  constructor(symbol: string, name: string, description?: string) {
    this.symbol = symbol.toUpperCase();
    this.name = name;
    this.description = description;
  }
}

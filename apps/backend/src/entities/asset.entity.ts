import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { AssetRepository } from '@/repositories/asset.repository';

/**
 * Represents a cryptocurrency or trading asset
 */
@Entity({ repository: () => AssetRepository })
export class Asset {
  [EntityRepositoryType]?: AssetRepository;
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  symbol!: string;

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  logoUrl?: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'boolean', default: false })
  isFiat = false;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

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

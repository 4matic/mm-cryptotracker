import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

/**
 * Represents a cryptocurrency or trading asset
 */
@Entity()
export class Asset {
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

  @Property({ nullable: true })
  marketCapRank?: number;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany('TradingPair', 'baseAsset')
  basePairs = new Collection<object>(this);

  @OneToMany('TradingPair', 'quoteAsset')
  quotePairs = new Collection<object>(this);

  constructor(symbol: string, name: string, description?: string) {
    this.symbol = symbol.toUpperCase();
    this.name = name;
    this.description = description;
  }
}

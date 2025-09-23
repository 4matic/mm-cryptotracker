import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

/**
 * Represents a data provider for cryptocurrency prices
 * Examples: Binance, CoinGecko, CoinMarketCap, etc.
 */
@Entity()
export class DataProvider {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ nullable: true })
  apiUrl?: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ type: 'json', nullable: true })
  apiConfig?: Record<string, unknown>;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'integer', default: 1000 })
  rateLimitPerHour = 1000;

  @Property({ type: 'integer', default: 1 })
  priority = 1;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany('PriceHistory', 'dataProvider')
  priceHistories = new Collection<object>(this);

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}

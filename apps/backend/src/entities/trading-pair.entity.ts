import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { Asset } from './asset.entity';
import { PriceHistory } from './price-history.entity';

/**
 * Represents a trading pair (e.g., BTC/USD, ETH/BTC)
 */
@Entity()
@Unique({ properties: ['baseAsset', 'quoteAsset'] })
export class TradingPair {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Asset)
  baseAsset!: Asset;

  @ManyToOne(() => Asset)
  quoteAsset!: Asset;

  @Property()
  symbol!: string;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'boolean', default: false })
  isVisible = false;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => PriceHistory, 'tradingPair')
  priceHistories = new Collection<PriceHistory>(this);

  constructor(baseAsset: Asset, quoteAsset: Asset) {
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.symbol = `${baseAsset.symbol}/${quoteAsset.symbol}`;
  }
}

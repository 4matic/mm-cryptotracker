import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { Asset } from '@/entities/asset.entity';

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

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  currentPrice?: string;

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  volume24h?: string;

  @Property({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  priceChange24h?: string;

  @Property({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  priceChangePercentage24h?: string;

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  high24h?: string;

  @Property({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  low24h?: string;

  @Property({ type: 'timestamp', nullable: true })
  lastUpdated?: Date;

  @Property({ type: 'boolean', default: true })
  isActive = true;

  @Property({ type: 'timestamp' })
  createdAt: Date = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany('PriceHistory', 'tradingPair')
  priceHistories = new Collection<object>(this);

  constructor(baseAsset: Asset, quoteAsset: Asset) {
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.symbol = `${baseAsset.symbol}/${quoteAsset.symbol}`;
  }

  /**
   * Updates the current price and related statistics
   */
  updatePrice(
    price: string,
    volume24h?: string,
    high24h?: string,
    low24h?: string
  ): void {
    const oldPrice = this.currentPrice;
    this.currentPrice = price;
    this.volume24h = volume24h;
    this.high24h = high24h;
    this.low24h = low24h;
    this.lastUpdated = new Date();

    if (oldPrice) {
      const oldPriceNum = parseFloat(oldPrice);
      const newPriceNum = parseFloat(price);
      this.priceChange24h = (newPriceNum - oldPriceNum).toFixed(8);
      this.priceChangePercentage24h = (
        ((newPriceNum - oldPriceNum) / oldPriceNum) *
        100
      ).toFixed(4);
    }
  }
}

import { DataProvider } from '@/entities/data-provider.entity';

/**
 * Interface for price data response from external APIs
 */
export interface PriceData {
  symbol: string;
  price: number;
  lastUpdated: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Interface for batch price fetching requests
 */
export interface PriceFetchRequest {
  symbols: string[];
  convertTo?: string;
}

/**
 * Abstract class for data provider implementations
 * Each data provider (CoinMarketCap, CoinGecko, etc.) should extend this class
 */
export abstract class AbstractDataProvider {
  protected readonly dataProvider: DataProvider;

  constructor(dataProvider: DataProvider) {
    this.dataProvider = dataProvider;
  }

  /**
   * Fetches price data for multiple symbols
   */
  abstract fetchPrices(request: PriceFetchRequest): Promise<PriceData[]>;

  /**
   * Validates if the provider is properly configured
   */
  abstract isConfigured(): boolean;

  /**
   * Gets the provider's rate limit per minute
   */
  getRateLimit(): number {
    return this.dataProvider.rateLimitPerMinute;
  }

  /**
   * Gets the provider's priority
   */
  getPriority(): number {
    return this.dataProvider.priority;
  }

  /**
   * Gets the provider's name
   */
  getName(): string {
    return this.dataProvider.name;
  }

  /**
   * Gets the provider's slug
   */
  getSlug(): string {
    return this.dataProvider.slug;
  }

  /**
   * Checks if the provider is active
   */
  isActive(): boolean {
    return this.dataProvider.isActive;
  }
}

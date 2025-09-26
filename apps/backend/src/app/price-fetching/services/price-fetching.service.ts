import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  EnsureRequestContext,
} from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { DataProvider } from '@/entities/data-provider.entity';
import { TradingPair } from '@/entities/trading-pair.entity';
import { PriceHistory } from '@/entities/price-history.entity';
import { Asset } from '@/entities/asset.entity';
import { DataProviderSlug } from '@/enums/data-provider.enum';
import {
  AbstractDataProvider,
  PriceData,
} from '../interfaces/abstract-data-provider.interface';
import { CoinmarketcapDataProvider } from '../providers/coinmarketcap-data-provider';
import { AssetRepository } from '@/repositories/asset.repository';
import { TradingPairRepository } from '@/repositories/trading-pair.repository';
import { Interval, Timeout } from '@nestjs/schedule';

/**
 * Request DTO for fetching prices
 */
export interface FetchPricesRequest {
  symbols: string[];
  convertTo?: string;
  dataProviderSlug?: DataProviderSlug;
}

/**
 * Response DTO for price fetching results
 */
export interface FetchPricesResponse {
  success: boolean;
  pricesUpdated: number;
  errors: string[];
  timestamp: Date;
}

/**
 * Service for fetching cryptocurrency prices from external data providers
 * and storing them in the database
 */
@Injectable()
export class PriceFetchingService {
  private readonly logger = new Logger(PriceFetchingService.name);
  private readonly dataProviders = new Map<string, AbstractDataProvider>();

  constructor(
    @InjectRepository(DataProvider)
    private readonly dataProviderRepository: EntityRepository<DataProvider>,
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: TradingPairRepository,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: EntityRepository<PriceHistory>,
    @InjectRepository(Asset)
    private readonly assetRepository: AssetRepository,
    private readonly em: EntityManager,
    private readonly httpService: HttpService
  ) {}

  /**
   * Initializes data providers by loading them from the database
   */
  @Timeout(1000)
  @EnsureRequestContext()
  async initializeDataProviders(): Promise<void> {
    try {
      const activeProviders = await this.dataProviderRepository.find({
        isActive: true,
      });

      this.logger.log(
        `Initializing ${activeProviders.length} active data providers`
      );

      for (const provider of activeProviders) {
        try {
          const dataProvider = this.createDataProvider(provider);
          if (dataProvider.isConfigured()) {
            this.dataProviders.set(provider.slug, dataProvider);
            this.logger.log(`Initialized data provider: ${provider.name}`);
          } else {
            this.logger.warn(
              `Data provider ${provider.name} is not properly configured`
            );
          }
        } catch (error) {
          this.logger.error(
            `Failed to initialize data provider ${provider.name}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      this.logger.log('Data providers initialization completed');
    } catch (error) {
      this.logger.error(
        `Failed to initialize data providers: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Fetches prices for specified symbols and stores them in the database
   */
  async fetchAndStorePrices(
    request: FetchPricesRequest
  ): Promise<FetchPricesResponse> {
    const { symbols, convertTo = 'USD', dataProviderSlug } = request;
    const errors: string[] = [];
    let pricesUpdated = 0;

    this.logger.log(
      `Fetching prices for ${symbols.length} symbols: ${symbols.join(', ')}`
    );

    // Get data providers to use
    const providersToUse = dataProviderSlug
      ? [this.dataProviders.get(dataProviderSlug)]
      : Array.from(this.dataProviders.values());

    const validProviders = providersToUse.filter(
      (provider): provider is AbstractDataProvider => !!provider
    );

    if (validProviders.length === 0) {
      const error = dataProviderSlug
        ? `Data provider with slug '${dataProviderSlug}' not found or not configured`
        : 'No active data providers available';
      errors.push(error);
      return {
        success: false,
        pricesUpdated: 0,
        errors,
        timestamp: new Date(),
      };
    }

    // Sort providers by priority (highest first)
    validProviders.sort((a, b) => b.getPriority() - a.getPriority());

    for (const provider of validProviders) {
      try {
        this.logger.debug(`Fetching prices from ${provider.getName()}`);

        const priceData = await provider.fetchPrices({
          symbols,
          convertTo,
        });

        const updated = await this.storePriceData(
          priceData,
          provider,
          convertTo
        );
        pricesUpdated += updated;

        this.logger.log(
          `Successfully updated ${updated} prices from ${provider.getName()}`
        );

        // If we got data from the highest priority provider, we can stop
        if (priceData.length > 0 && !dataProviderSlug) {
          break;
        }
      } catch (error) {
        const errorMessage = `Failed to fetch prices from ${provider.getName()}: ${
          error instanceof Error ? error.message : String(error)
        }`;
        this.logger.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    return {
      success: pricesUpdated > 0,
      pricesUpdated,
      errors,
      timestamp: new Date(),
    };
  }

  /**
   * Fetches prices for all active trading pairs
   */
  @Interval(
    parseInt(process.env.DATA_PROVIDERS_FETCH_INTERVAL_MS || '60000', 10)
  )
  @EnsureRequestContext()
  async fetchAllActivePairPrices(
    convertTo = 'USD'
  ): Promise<FetchPricesResponse> {
    const activePairs = await this.tradingPairRepository.find(
      { isActive: true },
      { populate: ['baseAsset', 'quoteAsset'] }
    );

    if (activePairs.length === 0) {
      return {
        success: true,
        pricesUpdated: 0,
        errors: ['No active trading pairs found'],
        timestamp: new Date(),
      };
    }

    // Extract unique base asset symbols
    const symbols = Array.from(
      new Set(activePairs.map((pair) => pair.baseAsset.symbol))
    );

    this.logger.log(
      `Fetching prices for ${symbols.length} unique symbols from ${activePairs.length} active trading pairs`
    );

    const response = await this.fetchAndStorePrices({ symbols, convertTo });

    this.logger.log(
      `All active pairs price fetching completed. Updated ${response.pricesUpdated} prices with ${response.errors.length} errors`
    );

    return response;
  }

  /**
   * Gets the status of all initialized data providers
   */
  getDataProviderStatus(): Array<{
    name: string;
    slug: string;
    isConfigured: boolean;
    isActive: boolean;
    priority: number;
    rateLimit: number;
  }> {
    return Array.from(this.dataProviders.values()).map((provider) => ({
      name: provider.getName(),
      slug: provider.getSlug(),
      isConfigured: provider.isConfigured(),
      isActive: provider.isActive(),
      priority: provider.getPriority(),
      rateLimit: provider.getRateLimit(),
    }));
  }

  /**
   * Creates a data provider instance based on the provider configuration
   */
  private createDataProvider(dataProvider: DataProvider): AbstractDataProvider {
    switch (dataProvider.slug) {
      case DataProviderSlug.Coinmarketcap:
        return CoinmarketcapDataProvider.create(dataProvider, this.httpService);
      default:
        throw new Error(`Unsupported data provider slug: ${dataProvider.slug}`);
    }
  }

  /**
   * Stores price data in the database
   */
  private async storePriceData(
    priceData: PriceData[],
    provider: AbstractDataProvider,
    convertTo: string
  ): Promise<number> {
    let updatedCount = 0;

    // Get the data provider entity
    const dataProviderEntity = await this.dataProviderRepository.findOne({
      slug: provider.getSlug(),
    });

    if (!dataProviderEntity) {
      throw new Error(`Data provider entity not found: ${provider.getSlug()}`);
    }

    // Get quote asset (USD, EUR, etc.)
    const quoteAsset = await this.assetRepository.findOne({
      symbol: convertTo,
    });

    if (!quoteAsset) {
      throw new Error(`Quote asset not found: ${convertTo}`);
    }

    for (const price of priceData) {
      try {
        // Find the base asset
        const baseAsset = await this.assetRepository.findOne({
          symbol: price.symbol,
        });

        if (!baseAsset) {
          this.logger.warn(`Base asset not found: ${price.symbol}`);
          continue;
        }

        // Find the trading pair
        const tradingPair = await this.tradingPairRepository.findOne({
          baseAsset: baseAsset.id,
          quoteAsset: quoteAsset.id,
        });

        if (!tradingPair) {
          this.logger.warn(
            `Trading pair not found: ${price.symbol}/${convertTo}`
          );
          continue;
        }

        // Check if we already have a recent price record
        const existingPrice = await this.priceHistoryRepository.findOne(
          {
            tradingPair: tradingPair.id,
            dataProvider: dataProviderEntity,
            timestamp: { $gte: new Date(Date.now() - 60000) }, // Within last minute
          },
          { orderBy: { timestamp: 'DESC' } }
        );

        if (existingPrice) {
          // Update existing price
          existingPrice.updatePrice(price.price.toString());
          existingPrice.metadata = {
            ...existingPrice.metadata,
            ...price.metadata,
          };
          this.em.persist(existingPrice);
        } else {
          // Create new price history record
          const priceHistory = new PriceHistory(
            tradingPair,
            dataProviderEntity,
            price.lastUpdated,
            price.price.toString()
          );
          priceHistory.metadata = price.metadata;
          this.em.persist(priceHistory);
        }

        updatedCount++;
      } catch (error) {
        this.logger.error(
          `Failed to store price data for ${price.symbol}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    await this.em.flush();
    return updatedCount;
  }
}

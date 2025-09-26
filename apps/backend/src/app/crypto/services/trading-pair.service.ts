import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EnsureRequestContext } from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { Asset } from '@/entities/asset.entity';
import { TradingPairRepository, AssetRepository } from '@/repositories';

/**
 * Service for managing trading pairs
 */
@Injectable()
export class TradingPairService {
  private readonly logger = new Logger(TradingPairService.name);

  constructor(
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: TradingPairRepository,
    @InjectRepository(Asset)
    private readonly assetRepository: AssetRepository,
    private readonly em: EntityManager
  ) {}

  /**
   * Creates a new trading pair
   */
  async createTradingPair(
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<TradingPair | null> {
    this.logger.log(`Creating trading pair: ${baseSymbol}/${quoteSymbol}`);

    const baseAsset = await this.assetRepository.findOne({
      symbol: baseSymbol.toUpperCase(),
    });
    const quoteAsset = await this.assetRepository.findOne({
      symbol: quoteSymbol.toUpperCase(),
    });

    if (!baseAsset || !quoteAsset) {
      this.logger.warn(
        `Cannot create trading pair ${baseSymbol}/${quoteSymbol}: missing assets (base: ${!!baseAsset}, quote: ${!!quoteAsset})`
      );
      return null;
    }

    const existingPair = await this.tradingPairRepository.findOne({
      baseAsset,
      quoteAsset,
    });

    if (existingPair) {
      this.logger.log(
        `Trading pair ${baseSymbol}/${quoteSymbol} already exists (ID: ${existingPair.id})`
      );
      return existingPair;
    }

    try {
      const tradingPair = new TradingPair(baseAsset, quoteAsset);
      await this.em.persistAndFlush(tradingPair);

      this.logger.log(
        `Successfully created trading pair: ${tradingPair.symbol} (ID: ${tradingPair.id})`
      );
      return tradingPair;
    } catch (error) {
      this.logger.error(
        `Failed to create trading pair ${baseSymbol}/${quoteSymbol}: ${error}`
      );
      throw error;
    }
  }

  /**
   * Finds a trading pair by symbol (e.g., "BTC/USD")
   */
  async findBySymbol(symbol: string): Promise<TradingPair | null> {
    this.logger.debug(`Looking up trading pair by symbol: ${symbol}`);

    const pair = await this.tradingPairRepository.findOne(
      { symbol },
      { populate: ['baseAsset', 'quoteAsset'] }
    );

    if (pair) {
      this.logger.debug(`Found trading pair: ${pair.symbol} (ID: ${pair.id})`);
    } else {
      this.logger.debug(`Trading pair not found with symbol: ${symbol}`);
    }

    return pair;
  }

  /**
   * Finds a trading pair by slug (e.g., "btc-usd")
   */
  @EnsureRequestContext()
  async findBySlug(slug: string): Promise<TradingPair | null> {
    return this.tradingPairRepository.findOne(
      { slug },
      { populate: ['baseAsset', 'quoteAsset'] }
    );
  }

  /**
   * Finds a trading pair by ID
   */
  @EnsureRequestContext()
  async findById(id: number): Promise<TradingPair | null> {
    return this.tradingPairRepository.findOne(id, {
      populate: ['baseAsset', 'quoteAsset'],
    });
  }

  /**
   * Gets all active trading pairs
   */
  @EnsureRequestContext()
  async findAllActive(): Promise<TradingPair[]> {
    return this.tradingPairRepository.find(
      { isActive: true },
      {
        populate: ['baseAsset', 'quoteAsset'],
        orderBy: { symbol: 'ASC' },
      }
    );
  }

  /**
   * Gets trading pairs for a specific base asset
   */
  async findByBaseAsset(baseSymbol: string): Promise<TradingPair[]> {
    const baseAsset = await this.assetRepository.findOne({
      symbol: baseSymbol.toUpperCase(),
    });
    if (!baseAsset) {
      return [];
    }

    return this.tradingPairRepository.find(
      { baseAsset, isActive: true },
      { populate: ['quoteAsset'], orderBy: { symbol: 'ASC' } }
    );
  }

  /**
   * Gets trading pairs with pagination
   */
  @EnsureRequestContext()
  async findWithPagination(
    page = 1,
    limit = 20,
    isVisible?: boolean
  ): Promise<{ pairs: TradingPair[]; total: number }> {
    const whereCondition: Record<string, unknown> = { isActive: true };

    if (isVisible !== undefined) {
      whereCondition.isVisible = isVisible;
    }

    const [pairs, total] = await this.tradingPairRepository.findAndCount(
      whereCondition,
      {
        populate: ['baseAsset', 'quoteAsset'],
        orderBy: { symbol: 'ASC' },
        limit,
        offset: (page - 1) * limit,
      }
    );

    return { pairs, total };
  }

  /**
   * Toggles the active status of a trading pair
   */
  async toggleActiveStatus(id: number): Promise<TradingPair | null> {
    const tradingPair = await this.tradingPairRepository.findOne(id);
    if (!tradingPair) {
      return null;
    }

    tradingPair.isActive = !tradingPair.isActive;
    await this.em.flush();
    return tradingPair;
  }
}

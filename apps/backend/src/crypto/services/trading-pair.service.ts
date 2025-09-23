import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { Asset } from '@/entities/asset.entity';

/**
 * Service for managing trading pairs
 */
@Injectable()
export class TradingPairService {
  constructor(
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: EntityRepository<TradingPair>,
    @InjectRepository(Asset)
    private readonly assetRepository: EntityRepository<Asset>,
    private readonly em: EntityManager
  ) {}

  /**
   * Creates a new trading pair
   */
  async createTradingPair(
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<TradingPair | null> {
    const baseAsset = await this.assetRepository.findOne({
      symbol: baseSymbol.toUpperCase(),
    });
    const quoteAsset = await this.assetRepository.findOne({
      symbol: quoteSymbol.toUpperCase(),
    });

    if (!baseAsset || !quoteAsset) {
      return null;
    }

    const existingPair = await this.tradingPairRepository.findOne({
      baseAsset,
      quoteAsset,
    });

    if (existingPair) {
      return existingPair;
    }

    const tradingPair = new TradingPair(baseAsset, quoteAsset);
    await this.em.persistAndFlush(tradingPair);
    return tradingPair;
  }

  /**
   * Finds a trading pair by symbol (e.g., "BTC/USD")
   */
  async findBySymbol(symbol: string): Promise<TradingPair | null> {
    return this.tradingPairRepository.findOne(
      { symbol },
      { populate: ['baseAsset', 'quoteAsset'] }
    );
  }

  /**
   * Finds a trading pair by ID
   */
  async findById(id: number): Promise<TradingPair | null> {
    return this.tradingPairRepository.findOne(id, {
      populate: ['baseAsset', 'quoteAsset'],
    });
  }

  /**
   * Gets all active trading pairs
   */
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
  async findWithPagination(
    page = 1,
    limit = 20
  ): Promise<{ pairs: TradingPair[]; total: number }> {
    const [pairs, total] = await this.tradingPairRepository.findAndCount(
      { isActive: true },
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

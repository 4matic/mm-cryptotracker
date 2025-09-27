import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EnsureRequestContext } from '@mikro-orm/core';
import { Asset } from '@/app/crypto/entities/asset.entity';
import { AssetRepository } from '@/app/crypto/repositories';

/**
 * Service for managing cryptocurrency assets
 */
@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: AssetRepository,
    private readonly em: EntityManager
  ) {}

  /**
   * Creates a new asset
   */
  async createAsset(
    symbol: string,
    name: string,
    description?: string
  ): Promise<Asset> {
    this.logger.log(`Creating asset: ${symbol} (${name})`);

    try {
      const asset = new Asset(symbol, name, description);
      await this.em.persistAndFlush(asset);

      const createdAsset = (await this.assetRepository.findOne(
        asset.id
      )) as Asset;
      this.logger.log(
        `Successfully created asset: ${symbol} with ID ${createdAsset.id}`
      );

      return createdAsset;
    } catch (error) {
      this.logger.error(`Failed to create asset ${symbol}: ${error}`);
      throw error;
    }
  }

  /**
   * Finds an asset by symbol
   */
  @EnsureRequestContext()
  async findBySymbol(symbol: string): Promise<Asset | null> {
    this.logger.debug(`Looking up asset by symbol: ${symbol}`);

    const asset = await this.assetRepository.findOne({
      symbol: symbol.toUpperCase(),
    });

    if (asset) {
      this.logger.debug(`Found asset: ${asset.symbol} (ID: ${asset.id})`);
    } else {
      this.logger.debug(`Asset not found with symbol: ${symbol}`);
    }

    return asset;
  }

  /**
   * Finds an asset by ID
   */
  @EnsureRequestContext()
  async findById(id: number): Promise<Asset | null> {
    return this.assetRepository.findOne(id);
  }

  /**
   * Gets all active assets
   */
  @EnsureRequestContext()
  async findAllActive(): Promise<Asset[]> {
    return this.assetRepository.find(
      { isActive: true },
      { orderBy: { symbol: 'ASC' } }
    );
  }

  /**
   * Updates an asset
   */
  async updateAsset(
    id: number,
    updateData: Partial<Asset>
  ): Promise<Asset | null> {
    this.logger.log(`Updating asset with ID: ${id}`);

    const asset = await this.assetRepository.findOne(id);
    if (!asset) {
      this.logger.warn(`Asset not found for update with ID: ${id}`);
      return null;
    }

    try {
      this.em.assign(asset, updateData);
      await this.em.flush();

      const updatedAsset = await this.assetRepository.findOne(id);
      this.logger.log(
        `Successfully updated asset: ${asset.symbol} (ID: ${id})`
      );

      return updatedAsset;
    } catch (error) {
      this.logger.error(`Failed to update asset ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Deactivates an asset
   */
  async deactivateAsset(id: number): Promise<boolean> {
    const asset = await this.assetRepository.findOne(id);
    if (!asset) {
      return false;
    }

    asset.isActive = false;
    await this.em.flush();
    return true;
  }

  /**
   * Gets assets with pagination
   */
  @EnsureRequestContext()
  async findWithPagination(
    page = 1,
    limit = 20
  ): Promise<{ assets: Asset[]; total: number }> {
    this.logger.debug(
      `Fetching assets with pagination - page: ${page}, limit: ${limit}`
    );

    const [assets, total] = await this.assetRepository.findAndCount(
      { isActive: true },
      {
        orderBy: { symbol: 'ASC' },
        limit,
        offset: (page - 1) * limit,
      }
    );

    this.logger.debug(
      `Retrieved ${assets.length} assets out of ${total} total`
    );

    return { assets, total };
  }
}

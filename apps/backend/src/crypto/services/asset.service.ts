import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { Asset } from '@/entities/asset.entity';

/**
 * Service for managing cryptocurrency assets
 */
@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: EntityRepository<Asset>,
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
    const asset = new Asset(symbol, name, description);
    await this.em.persistAndFlush(asset);
    return asset;
  }

  /**
   * Finds an asset by symbol
   */
  async findBySymbol(symbol: string): Promise<Asset | null> {
    return this.assetRepository.findOne({ symbol: symbol.toUpperCase() });
  }

  /**
   * Finds an asset by ID
   */
  async findById(id: number): Promise<Asset | null> {
    return this.assetRepository.findOne(id);
  }

  /**
   * Gets all active assets
   */
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
    const asset = await this.assetRepository.findOne(id);
    if (!asset) {
      return null;
    }

    this.em.assign(asset, updateData);
    await this.em.flush();
    return asset;
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
  async findWithPagination(
    page = 1,
    limit = 20
  ): Promise<{ assets: Asset[]; total: number }> {
    const [assets, total] = await this.assetRepository.findAndCount(
      { isActive: true },
      {
        orderBy: { symbol: 'ASC' },
        limit,
        offset: (page - 1) * limit,
      }
    );

    return { assets, total };
  }
}

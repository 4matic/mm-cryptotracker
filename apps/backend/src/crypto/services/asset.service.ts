import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  EnsureRequestContext,
} from '@mikro-orm/core';
import { Asset } from '@/entities/asset.entity';
import { AddAssetUrl } from '@/decorators';

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
  @AddAssetUrl()
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
  @AddAssetUrl()
  async findBySymbol(symbol: string): Promise<Asset | null> {
    return this.assetRepository.findOne({ symbol: symbol.toUpperCase() });
  }

  /**
   * Finds an asset by ID
   */
  @EnsureRequestContext()
  @AddAssetUrl()
  async findById(id: number): Promise<Asset | null> {
    return this.assetRepository.findOne(id);
  }

  /**
   * Gets all active assets
   */
  @AddAssetUrl()
  async findAllActive(): Promise<Asset[]> {
    return this.assetRepository.find(
      { isActive: true },
      { orderBy: { symbol: 'ASC' } }
    );
  }

  /**
   * Updates an asset
   */
  @AddAssetUrl()
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
  @AddAssetUrl<{ assets: Asset[]; total: number }>((result) => result.assets)
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

import { EntityRepository } from '@mikro-orm/postgresql';
import type {
  FilterQuery,
  FindOneOptions,
  FindOptions,
  Loaded,
} from '@mikro-orm/core';
import { Asset } from '@/entities/asset.entity';
import { transformAssetUrl } from '@/helpers/asset-url.helper';

/**
 * Custom repository for Asset entity with URL transformation
 */
export class AssetRepository extends EntityRepository<Asset> {
  /**
   * Transforms asset logoUrl using environment variable
   */
  private transformAsset<T>(asset: T): T {
    if (asset && typeof asset === 'object' && 'logoUrl' in asset) {
      const transformed = { ...asset };
      const assetWithLogo = transformed as T & { logoUrl?: string };
      if (assetWithLogo.logoUrl) {
        assetWithLogo.logoUrl = transformAssetUrl(assetWithLogo.logoUrl);
      }
      return transformed;
    }
    return asset;
  }

  /**
   * Transforms array of assets logoUrl using environment variable
   */
  private transformAssets<T>(assets: T[]): T[] {
    return assets.map((asset) => this.transformAsset(asset));
  }

  /**
   * Find one asset with URL transformation
   */
  override async findOne<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<Asset>,
    options?: FindOneOptions<Asset, Hint, Fields, Excludes>
  ): Promise<Loaded<Asset, Hint, Fields, Excludes> | null> {
    const asset = await super.findOne(where, options);
    return asset ? this.transformAsset(asset) : asset;
  }

  /**
   * Find multiple assets with URL transformation
   */
  override async find<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<Asset>,
    options?: FindOptions<Asset, Hint, Fields, Excludes>
  ): Promise<Loaded<Asset, Hint, Fields, Excludes>[]> {
    const assets = await super.find(where, options);
    return this.transformAssets(assets);
  }

  /**
   * Find and count assets with URL transformation
   */
  override async findAndCount<
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never
  >(
    where: FilterQuery<Asset>,
    options?: FindOptions<Asset, Hint, Fields, Excludes>
  ): Promise<[Loaded<Asset, Hint, Fields, Excludes>[], number]> {
    const [assets, count] = await super.findAndCount(where, options);
    return [this.transformAssets(assets), count];
  }
}

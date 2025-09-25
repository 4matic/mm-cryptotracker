import { Resolver, Query, Args, ID, Int } from '@nestjs/graphql';
import { AssetService } from '@/app/crypto/services/asset.service';
import { AssetModel } from '@mm-cryptotracker/shared-graphql';
import { Asset } from '@/entities/asset.entity';

/**
 * GraphQL resolver for Asset entity
 */
@Resolver(() => AssetModel)
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}

  @Query(() => [AssetModel])
  async assets(): Promise<Asset[]> {
    return this.assetService.findAllActive();
  }

  @Query(() => AssetModel, { nullable: true })
  async asset(
    @Args('id', { type: () => ID }) id: number
  ): Promise<Asset | null> {
    return this.assetService.findById(id);
  }

  @Query(() => AssetModel, { nullable: true })
  async assetBySymbol(@Args('symbol') symbol: string): Promise<Asset | null> {
    return this.assetService.findBySymbol(symbol);
  }

  @Query(() => [AssetModel])
  async assetsWithPagination(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number
  ): Promise<Asset[]> {
    const result = await this.assetService.findWithPagination(page, limit);
    return result.assets;
  }
}

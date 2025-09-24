import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { DataProviderService } from '@/crypto/services/data-provider.service';
import { DataProviderModel } from '@mm-cryptotracker/shared-graphql';
import { DataProvider } from '@/entities/data-provider.entity';

/**
 * GraphQL resolver for DataProvider entity
 */
@Resolver(() => DataProviderModel)
export class DataProviderResolver {
  constructor(private readonly dataProviderService: DataProviderService) {}

  @Query(() => [DataProviderModel])
  async dataProviders(): Promise<DataProvider[]> {
    return this.dataProviderService.findAllActive();
  }

  @Query(() => DataProviderModel, { nullable: true })
  async dataProvider(
    @Args('id', { type: () => ID }) id: number
  ): Promise<DataProvider | null> {
    return this.dataProviderService.findById(id);
  }

  @Query(() => DataProviderModel, { nullable: true })
  async dataProviderByName(
    @Args('name') name: string
  ): Promise<DataProvider | null> {
    return this.dataProviderService.findByName(name);
  }
}

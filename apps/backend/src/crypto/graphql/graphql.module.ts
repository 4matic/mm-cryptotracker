import { Module } from '@nestjs/common';
import {
  AssetResolver,
  // TradingPairResolver,
  // DataProviderResolver,
  // PriceHistoryResolver,
} from '@/crypto/graphql/resolvers';
import { AssetService } from '@/crypto/services/asset.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset } from '@/entities/asset.entity';

/**
 * GraphQL module that provides all GraphQL resolvers
 */
@Module({
  imports: [MikroOrmModule.forFeature([Asset])],
  providers: [
    AssetService,
    AssetResolver,
    // TradingPairResolver,
    // DataProviderResolver,
    // PriceHistoryResolver,
  ],
  exports: [
    AssetResolver,
    // TradingPairResolver,
    // DataProviderResolver,
    // PriceHistoryResolver,
  ],
})
export class GraphQLApiModule {}

import { Module } from '@nestjs/common';
import {
  AssetResolver,
  TradingPairResolver,
  DataProviderResolver,
  PriceHistoryResolver,
} from '@/crypto/graphql/resolvers';
import { CryptoModule } from '@/crypto/crypto.module';

/**
 * GraphQL module that provides all GraphQL resolvers
 */
@Module({
  imports: [CryptoModule],
  providers: [
    AssetResolver,
    TradingPairResolver,
    DataProviderResolver,
    PriceHistoryResolver,
  ],
})
export class GraphQLApiModule {}

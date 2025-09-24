import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AssetModel } from '@/crypto/graphql/models/asset.model';
import { PriceHistoryModel } from '@/crypto/graphql/models/price-history.model';

/**
 * GraphQL model for TradingPair entity
 */
@ObjectType()
export class TradingPairModel {
  @Field(() => ID)
  id!: number;

  @Field(() => AssetModel)
  baseAsset!: AssetModel;

  @Field(() => AssetModel)
  quoteAsset!: AssetModel;

  @Field()
  symbol!: string;

  @Field()
  isActive!: boolean;

  @Field()
  isVisible!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => PriceHistoryModel, { nullable: true })
  latestPrice?: PriceHistoryModel;

  @Field(() => PriceHistoryModel, { nullable: true })
  calculatedPrice?: PriceHistoryModel;
}

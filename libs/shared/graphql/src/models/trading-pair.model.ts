import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AssetModel } from './asset.model.js';
import { PriceHistoryModel } from './price-history.model.js';

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

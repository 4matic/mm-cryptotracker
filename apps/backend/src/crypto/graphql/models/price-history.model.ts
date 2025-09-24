import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { TradingPairModel } from './trading-pair.model';
import { DataProviderModel } from './data-provider.model';

/**
 * GraphQL model for PriceHistory entity
 */
@ObjectType()
export class PriceHistoryModel {
  @Field(() => ID)
  id!: number;

  @Field(() => TradingPairModel)
  tradingPair!: TradingPairModel;

  @Field(() => DataProviderModel)
  dataProvider!: DataProviderModel;

  @Field()
  timestamp!: Date;

  @Field()
  price!: string;

  @Field({ nullable: true })
  lastUpdated?: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;

  @Field()
  createdAt!: Date;
}

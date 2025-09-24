import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TradingPairModel } from './trading-pair.model.js';

@ObjectType()
export class PaginatedTradingPairsModel {
  @Field(() => [TradingPairModel])
  pairs!: TradingPairModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;
}

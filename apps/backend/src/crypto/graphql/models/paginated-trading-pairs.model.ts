import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TradingPairModel } from '@/crypto/graphql/models/trading-pair.model';

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

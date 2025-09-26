import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

/**
 * GraphQL model for DataProvider entity
 */
@ObjectType()
export class DataProviderModel {
  @Field(() => ID)
  id!: number;

  @Field()
  slug!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  apiUrl?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  isActive!: boolean;

  @Field(() => Int)
  rateLimitPerMinute!: number;

  @Field(() => Int)
  priority!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL model for Asset entity
 */
@ObjectType()
export class AssetModel {
  @Field(() => ID)
  id!: number;

  @Field()
  symbol!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field({ nullable: true })
  website?: string;

  @Field()
  isActive!: boolean;

  @Field()
  isFiat!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

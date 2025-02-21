import { Restaurant } from '@app/shared';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Food {
  @Field(() => ID)
  id?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Number)
  price: number;

  @Field(() => Number, { nullable: true })
  estimatedPrice?: number;

  @Field(() => String)
  category: string;

  @Field(() => [String])
  images: string[];

  @Field(() => String)
  restaurantId: string;

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;

  @Field(() => Boolean)
  is_active: boolean;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;
}

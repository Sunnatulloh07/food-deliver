import { Field, ObjectType } from '@nestjs/graphql';
import { Food } from '../entities/food.entity';

@ObjectType('ErrorFood')
export class ErrorFood {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType('CreateFoodResponse')
export class CreateFoodResponse {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => ErrorFood, { nullable: true })
  error?: ErrorFood;
}

@ObjectType('GetAllFoodsResponse')
export class GetAllFoodsResponse {
  @Field()
  success: boolean;

  @Field(() => [Food])
  data: Food[];

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => ErrorFood, { nullable: true })
  error?: ErrorFood;
}

@ObjectType('DeleteFoodResponse')
export class DeleteFoodResponse {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => ErrorFood, { nullable: true })
  error?: ErrorFood;
}

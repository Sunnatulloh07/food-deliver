import { Restaurant } from '@app/shared/entities';
import { Field, ObjectType, Directive } from '@nestjs/graphql';

@ObjectType('RestaurantErrorType')
@Directive('@shareable')
export class RestaurantErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType('RestaurantRegisterResponse')
export class RestaurantRegisterResponse {
  @Field(() => String)
  message: string;

  @Field(() => RestaurantErrorType, { nullable: true })
  error?: RestaurantErrorType;
}

@ObjectType('RestaurantActivationResponse')
export class RestaurantActivationResponse {
  @Field(() => String)
  message: string;

  @Field(() => RestaurantErrorType, { nullable: true })
  error?: RestaurantErrorType;
}

@ObjectType('RestaurantLoginResponse')
export class RestaurantLoginResponse {
  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => String, {nullable:true})
  access_token_restaurant?: string;

  @Field(() => String, {nullable:true})
  refresh_token_restaurant?: string;

  @Field(() => RestaurantErrorType, { nullable: true })
  error?: RestaurantErrorType;
}

@ObjectType('RestaurantLogoutResponseResponse')
export class RestaurantLogoutResponseResponse {
  @Field()
  message: string;

  @Field(() => RestaurantErrorType, { nullable: true })
  error?: RestaurantErrorType;
}

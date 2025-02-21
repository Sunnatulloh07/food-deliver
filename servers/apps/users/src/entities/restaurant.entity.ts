import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Restaurant {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field(() => String, { nullable: true })
  @Directive('@external')
  name?: string;
}

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Picture {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field(() => String)
  @Directive('@external')
  public_id: string;

  @Field(() => String)
  @Directive('@external')
  url: string;

  @Field(() => String)
  @Directive('@external')
  restaurantId: string;
}

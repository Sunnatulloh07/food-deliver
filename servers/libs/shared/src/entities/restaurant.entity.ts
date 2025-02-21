import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Picture {
  @Field(() => ID)
  id: string;

  @Directive('@shareable')
  @Field()
  public_id?: string;

  @Directive('@shareable')
  @Field()
  url: string;

  @Directive('@shareable')
  @Field()
  restaurantId?: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class Restaurant {
  @Field(() => ID)
  id: string;

  @Directive('@shareable')
  @Field()
  name: string;

  @Directive('@shareable')
  @Field()
  country: string;

  @Directive('@shareable')
  @Field()
  city: string;

  @Directive('@shareable')
  @Field()
  region: string;

  @Directive('@shareable')
  @Field()
  email: string;

  @Directive('@shareable')
  @Field()
  phone_number: number;

  @Directive('@shareable')
  @Field()
  password?: string;

  @Directive('@shareable')
  @Field(() => Picture, { nullable: true })
  picture?: Picture | null;

  @Directive('@shareable')
  @Field()
  createdAt: Date;

  @Directive('@shareable')
  @Field()
  updatedAt: Date;
}

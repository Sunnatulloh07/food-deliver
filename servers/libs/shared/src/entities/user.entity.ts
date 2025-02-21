import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Avatar {
  @Field(() => ID)
  id: string;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  public_id?: string;

  @Directive('@shareable')
  @Field(() => String)
  url: string;

  @Directive('@shareable')
  @Field(() => String)
  userId?: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Directive('@shareable')
  @Field(() => String)
  name: string;

  @Directive('@shareable')
  @Field(() => String)
  email: string;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  password?: string;

  @Directive('@shareable')
  @Field(() => Number, { nullable: true })
  phone_number?: number;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  address?: string;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  role?: string;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  createdAt: Date;

  @Directive('@shareable')
  @Field(() => String, { nullable: true })
  updatedAt: Date;

  @Directive('@shareable')
  @Field(() => Avatar, { nullable: true })
  avatar?: Avatar | null;
}

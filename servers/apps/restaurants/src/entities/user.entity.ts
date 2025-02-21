import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends') // Asosiy subgraph `users`
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;

  @Field(() => String, { nullable: true })
  @Directive('@external')
  name?: string;

  @Field(() => String, { nullable: true })
  @Directive('@external')
  email?: string;
}

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Avatar {
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
  userId: string;
}

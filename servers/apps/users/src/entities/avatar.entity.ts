import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Avatar {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  public_id?: string;

  @Field(() => String)
  url: string;

  @Field(() => User, { nullable: true })
  user?: User | null;
}

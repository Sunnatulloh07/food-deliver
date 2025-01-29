import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Avatar } from './avatar.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => Number, { nullable: true })
  phone_number?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Avatar, { nullable: true })
  avatar: Avatar | null;

  @Field(() => String, { nullable: true })
  role?: string;

  @Field(() => String, { nullable: true })
  createdAt: Date;

  @Field(() => String, { nullable: true })
  updatedAt: Date;
}

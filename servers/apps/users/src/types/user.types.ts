import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field(() => String)
  message: string;

  @Field(() => String)
  code: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => String)
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

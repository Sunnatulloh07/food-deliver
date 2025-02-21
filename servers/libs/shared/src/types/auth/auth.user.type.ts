import { User } from '@app/shared';
import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ErrorTypeAuth')
@Directive('@shareable')
export class ErrorTypeAuth {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType('LoginAuthResponse')
export class LoginAuthResponse {
  @Field(() => User)
  user: User;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

@ObjectType('RegisterAuthResponse')
export class RegisterAuthResponse {
  @Field(() => String)
  activation_token: string;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

@ObjectType('ActivationAuthResponse')
export class ActivationAuthResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

@ObjectType('LogoutAuthResponse')
export class LogoutAuthResponse {
  @Field()
  message: string;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

@ObjectType('ForgotPasswordAuthResponse')
export class ForgotPasswordAuthResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

@ObjectType('ResetPasswordAuthResponse')
export class ResetPasswordAuthResponse {
  @Field(() => String)
  message: string;

  @Field(() => ErrorTypeAuth, { nullable: true })
  error?: ErrorTypeAuth;
}

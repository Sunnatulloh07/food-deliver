import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field(() => Number)
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber({}, { message: 'Phone number must be a number' })
  phone_number: number;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

@InputType()
export class LoginDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

@InputType()
export class ActivationDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Activation token is required' })
  activationToken: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Activation code is required' })
  activationCode: string;
}

@InputType()
export class ForgotPasswordDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'Token must be a string' })
  token: string;
}

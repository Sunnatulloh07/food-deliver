import { Field, InputType } from '@nestjs/graphql';
import { Avatar } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class PictureInput {
  @Field(() => String)
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a string' })
  public_id: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a string' })
  url: string;
}

@InputType()
export class RestaurantDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Country is required' })
  @IsString({ message: 'Country must be a string' })
  country: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Region is required' })
  @IsString({ message: 'Region must be a string' })
  region: string;

  @Field(() => Number)
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber({}, { message: 'Phone number must be a number' })
  phone_number: number;

  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;

  @Field(() => PictureInput, { nullable: true })
  picture: PictureInput | null;
}

@InputType()
export class RestaurantLoginDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}

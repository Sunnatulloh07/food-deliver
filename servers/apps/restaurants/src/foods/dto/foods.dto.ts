import { Field, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";


@InputType()
export class CreateFoodDto {
    @Field(() => String)    
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @Field(() => String)
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @Field(() => Number)
    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber()
    price: number;

    @Field(() => String)
    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    category: string;
    
    @Field(() => Number, { nullable: true })
    @IsNotEmpty({ message: 'Estimated price is required' })
    @IsNumber()
    estimatedPrice?: number;

    @Field(() => [String])
    @IsArray({ message: 'Food images must be an array' })
    @ArrayNotEmpty({ message: 'Food images are required' })
    images: string[];
}

// @InputType()
// export class UpdateFoodInput {
//     @Field()
//     name: string;

//     @Field()
//     description: string;

//     @Field()
//     price: number;

//     @Field()
//     restaurantId: string;
// }
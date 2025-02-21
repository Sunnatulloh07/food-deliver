import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FoodsService } from './food.service';
import {
  CreateFoodResponse,
  DeleteFoodResponse,
  GetAllFoodsResponse,
} from './types/foods.types';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateFoodDto } from './dto/foods.dto';
import { RestaurantAuthGuard } from '@app/shared';

@Resolver('Foods')
export class FoodResolver {
  constructor(private readonly foodsService: FoodsService) {}

  @Mutation(() => CreateFoodResponse)
  @UseGuards(RestaurantAuthGuard)
  async createFoods(
    @Context() context: { req: Request; res: Response },
    @Args('createFoodDto') createFoodDto: CreateFoodDto,
  ) {
    return await this.foodsService.createFood(
      createFoodDto,
      context.req,
      context.res,
    );
  }

  @Query(() => GetAllFoodsResponse)
  @UseGuards(RestaurantAuthGuard)
  async getRestourantAllFoods(
    @Context() context: { req: Request; res: Response },
  ) {
    return await this.foodsService.getRestourantAllFoods(context.req);
  }

  // delete food by restourant id
  @Mutation(() => DeleteFoodResponse)
  @UseGuards(RestaurantAuthGuard)
  async deleteFoodById(
    @Context() context: { req: Request; res: Response },
    @Args('id') id: string,
  ) {
    return await this.foodsService.deleteFoodById(context.req, id);
  }
}

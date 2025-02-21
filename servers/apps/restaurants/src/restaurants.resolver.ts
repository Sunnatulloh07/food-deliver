import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Restaurant } from '@app/shared';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}
}

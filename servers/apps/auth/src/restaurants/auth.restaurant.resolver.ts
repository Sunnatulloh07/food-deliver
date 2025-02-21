import { Context, Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthRestaurantService } from './auth.restaurant.service';
import { UseGuards } from '@nestjs/common';
import {
  RestaurantActivationResponse,
  RestaurantAuthGuard,
  RestaurantLoginResponse,
  RestaurantLogoutResponseResponse,
  RestaurantRegisterResponse,
} from '@app/shared';
import { RestaurantDto, RestaurantLoginDto } from '../dto/auth.restaurant.dto';
import { Request, Response } from 'express';

@Resolver()
export class AuthRestaurantResolver {
  constructor(private readonly authRestaurantService: AuthRestaurantService) {}

  @Mutation(() => RestaurantRegisterResponse)
  async registerRestaurant(
    @Args('restaurantDto') restaurantDto: RestaurantDto,
    @Context() context: { res: Response },
  ): Promise<RestaurantRegisterResponse> {
    return this.authRestaurantService.registerRestaurant(
      restaurantDto,
      context.res,
    );
  }

  @Mutation(() => RestaurantActivationResponse)
  async activateRestaurant(
    @Args('token') token: string,
    @Args('code') code: string,
  ): Promise<RestaurantActivationResponse> {
    return this.authRestaurantService.activateRestaurant(token, code);
  }

  @Mutation(() => RestaurantLoginResponse)
  async loginRestaurant(
    @Args('loginDto') loginDto: RestaurantLoginDto,
    @Context() context: { req: Request; res: Response },
  ): Promise<RestaurantLoginResponse> {
    return this.authRestaurantService.loginRestaurant(loginDto, context.res);
  }

  @Query(() => RestaurantLoginResponse)
  @UseGuards(RestaurantAuthGuard)
  async getLoggedInRestaurant(
    @Context() context: { req: Request },
  ): Promise<RestaurantLoginResponse> {
    return await this.authRestaurantService.getLoggedInRestaurant(context.req);
  }

  @Query(() => RestaurantLogoutResponseResponse)
  @UseGuards(RestaurantAuthGuard)
  async logOutRestaurant(
    @Context() context: { req: Request },
  ): Promise<RestaurantLogoutResponseResponse> {
    return await this.authRestaurantService.logoutRestaurant(context.req);
  }
}

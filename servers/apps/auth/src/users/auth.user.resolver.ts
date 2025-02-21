import { AuthGuard, User } from '@app/shared';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUserService } from './auth.user.service';
import {
  ActivationAuthResponse,
  ForgotPasswordAuthResponse,
  LoginAuthResponse,
  LogoutAuthResponse,
  RegisterAuthResponse,
  ResetPasswordAuthResponse,
} from '@app/shared/types';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto/auth.user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

@Resolver(() => User)
export class AuthUserResolver {
  constructor(private readonly usersService: AuthUserService) {}

  @Mutation(() => RegisterAuthResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterAuthResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );
    return { activation_token };
  }

  @Mutation(() => ActivationAuthResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationAuthResponse> {
    return this.usersService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginAuthResponse)
  async login(
    @Args('loginDto') loginDto: LoginDto,
    @Context() context: { req: Request; res: Response },
  ): Promise<LoginAuthResponse> {
    return this.usersService.login(loginDto, context.res);
  }

  @Mutation(() => ForgotPasswordAuthResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordAuthResponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordAuthResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordAuthResponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  @Query(() => LoginAuthResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(
    @Context() context: { req: Request },
  ): Promise<LoginAuthResponse> {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Query(() => LogoutAuthResponse)
  @UseGuards(AuthGuard)
  async logOutUser(
    @Context() context: {req:Request, res: Response },
  ): Promise<LogoutAuthResponse> {
    return await this.usersService.logOutUser(context.req,context.res);
  }
}

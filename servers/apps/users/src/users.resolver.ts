import { Mutation, Args, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './types/user.types';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );
    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return this.usersService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<LoginResponse> {
    return this.usersService.login(loginDto);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(
    @Context() context: { req: Request },
  ): Promise<LoginResponse> {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logOutUser(
    @Context() context: { req: Request },
  ): Promise<LogoutResponse> {
    return await this.usersService.logOutUser(context.req);
  }

  @Query(() => [User])
  @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    const users = await this.usersService.findAllUsers();
    return users;
  }
}

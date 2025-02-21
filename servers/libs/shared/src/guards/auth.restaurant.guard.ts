import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SendToken } from '@app/utils';
import { Restaurant } from '../entities';

@Injectable()
export class RestaurantAuthGuard implements CanActivate {
  // In-memory cache: Bu oddiy yechim bo‘lib, production uchun Redis kabi tashqi keshdan foydalanish yaxshiroq
  private restaurantCache = new Map<string, Restaurant>();

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const response = gqlContext.getContext().res;

    const accessToken = (request.cookies.access_token_restaurant ||
      request.headers.access_token_restaurant) as string;
    const refreshToken = (request.cookies.refresh_token_restaurant ||
      request.headers.refresh_token_restaurant) as string;
      
    // Tokenlarni tekshirish va yangilash
    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    } else if (!accessToken && refreshToken) {
      await this.updateAccessToken(context);
      return true;
    }

    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.get('RESTAURANTS_ACCESS_TOKEN_SECRET'),
      });

      if (decoded.exp * 1000 < Date.now()) {
        await this.updateAccessToken(context);
        return true;
      }

      const restaurant = await this.prisma.restaurant.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!restaurant) {
        throw new UnauthorizedException('Restaurant not found');
      }

      request.restaurant = restaurant;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        await this.updateAccessToken(context);
        return true;
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private async updateAccessToken(context: ExecutionContext) {
    try {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext().req;
      const response = gqlContext.getContext().res;
      const refreshTokenHeader = (request.cookies.refresh_token_restaurant ||
        request.headers.refresh_token_restaurant) as string;

      const decoded = this.jwtService.verify(refreshTokenHeader, {
        secret: this.configService.get('RESTAURANTS_REFRESH_TOKEN_SECRET'),
      });

      const resData = await this.prisma.restaurant.findUnique({
        where: { id: decoded.id },
        include: { picture: true },
      });

      if (!resData) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { password, ...restaurant } = resData;
      const sendToken = new SendToken(this.jwtService, this.configService);
      const { accessToken, refreshToken } =
        await sendToken.createRestaurantToken(restaurant as any);

      // Tokenlarni cookie'ga saqlash
      response.cookie('access_token_restaurant', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
        maxAge: 1000 * 60 * 30, // 30 minutes
      });

      response.cookie('refresh_token_restaurant', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      });

      request.restaurant = restaurant;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

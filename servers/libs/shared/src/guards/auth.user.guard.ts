import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SendToken } from '@app/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    const accessToken = (request.cookies.access_token_user ||
      request.headers.access_token_user) as string;
    const refreshToken = (request.cookies.refresh_token_user ||
      request.headers.refresh_token_user) as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid access token!');
      }

      if (decoded.exp * 1000 < Date.now()) {
        await this.updateAccessToken(context);
        return true;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          avatar: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found!');
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        await this.updateAccessToken(context);
        return true;
      }
      throw new UnauthorizedException('Invalid token!');
    }
  }

  private async updateAccessToken(context: ExecutionContext): Promise<void> {
    const { req: request, res: response } =
      GqlExecutionContext.create(context).getContext();

    const refreshToken = request.headers.refreshtoken as string;

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException(
          'Please login to access this resource!',
        );
      }

      if (decoded.exp * 1000 < Date.now()) {
        throw new UnauthorizedException(
          'Refresh token expired! Please login again.',
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          avatar: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found!');
      }

      const sendToken = new SendToken(this.jwtService, this.config);
      const tokens = await sendToken.sendToken(user);

      // Tokenlarni cookie'ga saqlash
      response.cookie('access_token_user', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
        maxAge: 1000 * 60 * 30, // 30 minutes
      });

      response.cookie('refresh_token_user', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      });

      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { SendToken } from '../utils/sendToken';
import { PrismaService } from '../../../../prisma/prisma.service';

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

    const accessToken = request.headers.accesstoken as string;
    const refreshToken = request.headers.refreshtoken as string;

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
        await this.updateAccessToken(request);
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
        await this.updateAccessToken(request);
        return true;
      }
      throw new UnauthorizedException('Invalid token!');
    }
  }

  private async updateAccessToken(request: any): Promise<void> {
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

      request.headers.accesstoken = tokens.accessToken;
      request.headers.refreshtoken = tokens.refreshToken;
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }
}

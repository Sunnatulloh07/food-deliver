import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Restaurant, User } from '@prisma/client';

@Injectable()
export class SendToken {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async sendToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    return { accessToken, refreshToken };
  }

  public async createRestaurantToken(
    restaurant: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { id: restaurant.id },
      {
        secret: this.configService.get('RESTAURANTS_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get(
          'RESTAURANTS_ACCESS_TOKEN_EXPIRES_IN',
        ),
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: restaurant.id },
      {
        secret: this.configService.get('RESTAURANTS_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get(
          'RESTAURANTS_REFRESH_TOKEN_EXPIRES_IN',
        ),
      },
    );

    return { accessToken, refreshToken };
  }

  public async forgotPasswordToken(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('FORGOT_PASSWORD_SECRET'),
        expiresIn: this.configService.get('FORGOT_PASSWORD_EXPIRES_IN'),
      },
    );

    return forgotPasswordToken;
  }

  public async resetPasswordTokenVerify(token: string) {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get('FORGOT_PASSWORD_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token expired time!');
    }
  }

  public async createActivationToken(user: User) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: this.configService.get<string>(
          'ACTIVATION_SECRET_EXPIRES_IN',
        ),
      },
    );

    return { token, activationCode };
  }

  public async createActivationTokenRestaurant(restaurant: Restaurant) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        restaurant,
        activationCode,
      },
      {
        secret: this.configService.get<string>('RESTAURANT_ACTIVATION_SECRET'),
        expiresIn: this.configService.get<string>(
          'RESTAURANTS_ACTIVATION_SECRET_EXPIRES_IN',
        ),
      },
    );

    return { token, activationCode };
  }

  public async activateRestaurantTokenVerify(token: string) {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('RESTAURANT_ACTIVATION_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token expired time!');
    }
  }
}

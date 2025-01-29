import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

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
}

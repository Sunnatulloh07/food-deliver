import { EmailService } from '@app/email';
import { BcryptGenerater, SendToken } from '@app/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto/auth.user.dto';
import { LoginAuthResponse, OAuthUserData, UserData } from '@app/shared/types';
import { User } from '@prisma/client/edge';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptGenerater: BcryptGenerater,
    private readonly sendToken: SendToken,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExists = await this.prisma.user.findUnique({
      where: {
        email,
        phone_number,
      },
    });

    if (isEmailExists) {
      throw new BadRequestException(
        'Email already exists, please try another email',
      );
    }

    const isPhoneNumberExists = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (isPhoneNumberExists) {
      throw new BadRequestException(
        'Phone number already exists, please try another phone number',
      );
    }

    const hashedPassword = await this.bcryptGenerater.hashPassword(password);

    const userData: UserData = {
      name,
      email,
      phone_number,
      password: hashedPassword,
    };

    const { token, activationCode } =
      await this.sendToken.createActivationToken(userData as User);
    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-email',
      name,
      activationCode,
    });

    return { activation_token: token };
  }

  // activate user
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const decoded: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      }) as { user: UserData; activationCode: string };

    if (decoded.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, phone_number, password } = decoded.user;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        password,
      },
    });

    return { message: 'User activated successfully' };
  }

  // login user
  async login(loginDto: LoginDto, res: Response): Promise<LoginAuthResponse> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });

    if (user && !user.password) {
      throw new BadRequestException('Please use social login');
    }

    if (
      !user ||
      !(await this.bcryptGenerater.comparePassword(password, user.password))
    ) {
      throw new BadRequestException('Invalid email or password');
    }
    const { accessToken, refreshToken } = await this.sendToken.sendToken(user);

    // Tokenlarni cookie'ga saqlash
    res.cookie('access_token_user', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    res.cookie('refresh_token_user', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    });

    return { user };
  }

  // forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const token = await this.sendToken.forgotPasswordToken(user);
    const resetPasswordLink = `${this.configService.get<string>('CLIENT_SITE_URL')}/reset-password?verify=${token}`;

    this.emailService.sendMail({
      email: user.email,
      subject: 'Reset your password',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordLink,
    });

    return { message: 'Password reset link sent successfully' };
  }

  // reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, token } = resetPasswordDto;
    const decoded = await this.sendToken.resetPasswordTokenVerify(token);
    const { id } = decoded;
    const hashedPassword = await this.bcryptGenerater.hashPassword(password);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully' };
  }

  // get logged in user
  async getLoggedInUser(req: any) {
    const user = req.user;
    return { user };
  }

  // log out user
  async logOutUser(req: Request, res: Response) {
    req.user = null;
    res.cookie('access_token_user', null);
    res.cookie('refresh_token_user', null);
    return { message: 'Logged out successfully' };
  }

  // validate oauth user
  async validateOAuthUser(oAuthUserData: any) {
    const { provider, social_id, email, name, picture } = oAuthUserData;

    let user = await this.prisma.user.findUnique({
      where: { social_id: social_id },
    });

    if (!user && email) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: name ?? 'No Name',
          email: email ?? '',
          social_id,
          provider,
          avatar: {
            create: {
              url: picture,
            },
          },
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          social_id,
          provider,
          avatar: {
            update: {
              where: { userId: user.id },
              data: { url: picture },
            },
          },
        },
      });
    }

    return user;
  }
}

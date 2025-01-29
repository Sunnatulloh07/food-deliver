import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { LoginResponse } from './types/user.types';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import { OAuthUserData, UserData } from './types/user-data.interface';
import { EmailService } from './email/email.service';
import { SendToken } from './utils/sendToken';
import { BcryptGenerater } from './utils/bcryptGenerater';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly bcryptGenerater: BcryptGenerater,
  ) {}

  // register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExists = await this.prisma.user.findUnique({
      where: {
        email,
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
      await this.createActivationToken(userData);
    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-email',
      name,
      activationCode,
    });

    return { activation_token: token };
  }

  //  create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '10m',
      },
    );

    return { token, activationCode };
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
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });

    if (
      !user ||
      !(await this.bcryptGenerater.comparePassword(password, user.password))
    ) {
      throw new BadRequestException('Invalid email or password');
    }
    const tokenSender = new SendToken(this.jwtService, this.configService);
    const { accessToken, refreshToken } = await tokenSender.sendToken(user);
    return { user, accessToken, refreshToken };
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
    const tokenSender = new SendToken(this.jwtService, this.configService);
    const forgotPasswordToken = await tokenSender.forgotPasswordToken(user);
    const resetPasswordLink = `${this.configService.get<string>('CLIENT_SITE_URL')}/reset-password?verify=${forgotPasswordToken}`;

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
    const tokenSender = new SendToken(this.jwtService, this.configService);
    const decoded = await tokenSender.resetPasswordTokenVerify(token);
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
    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;
    return { user, accessToken, refreshToken };
  }

  // log out user
  async logOutUser(req: any) {
    req.user = null;
    req.headers.accesstoken = null;
    req.headers.refreshtoken = null;
    return { message: 'Logged out successfully' };
  }

  // find all users
  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        avatar: true,
      },
    });
    return users;
  }

  // validate oauth user
  async validateOAuthUser(oAuthUserData: OAuthUserData) {
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

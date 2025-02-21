import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BcryptGenerater, SendToken } from '@app/utils';
import { EmailService } from '@app/email';
import { RestaurantDto, RestaurantLoginDto } from '../dto/auth.restaurant.dto';
import {
  RestaurantData,
  RestaurantLoginResponse,
  RestaurantRegisterResponse,
} from '@app/shared';
import { Restaurant } from '@prisma/client';
import { Request, Response } from 'express';

@Injectable()
export class AuthRestaurantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptGenerater: BcryptGenerater,
    private readonly sendToken: SendToken,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async registerRestaurant(
    restaurantDto: RestaurantDto,
    response: Response,
  ): Promise<RestaurantRegisterResponse> {
    const {
      name,
      country,
      city,
      region,
      phone_number,
      email,
      password,
      picture,
    } = restaurantDto;

    const isEmailExists = await this.prisma.restaurant.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExists) {
      throw new BadRequestException(
        'Email already exists, please try another email',
      );
    }

    const isPhoneNumberExists = await this.prisma.restaurant.findUnique({
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

    const restaurantData: RestaurantData = {
      name,
      country,
      city,
      region,
      phone_number,
      email,
      password: hashedPassword,
      picture,
    };

    const { token, activationCode } =
      await this.sendToken.createActivationTokenRestaurant(
        restaurantData as any,
      );

    const activationLink = `${this.configService.get<string>('ADMIN_SITE_URL')}/activate-restaurant?verify=${token}&code=${activationCode}`;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-email-restaurant',
      name,
      activationCode: activationLink,
    });

    return { message: 'Restaurant registered successfully' };
  }

  async activateRestaurant(token: string, code: string) {
    const decoded = await this.sendToken.activateRestaurantTokenVerify(token);

    if (!decoded) {
      throw new BadRequestException('Invalid token');
    }

    const { activationCode } = decoded;

    if (activationCode !== code) {
      throw new BadRequestException('Invalid activation code');
    }

    const restaurant = await this.prisma.restaurant.findUnique({
      where: {
        email: decoded.restaurant.email,
      },
    });

    if (restaurant) {
      throw new BadRequestException('Restaurant already activated');
    }
    await this.prisma.restaurant.create({
      data: {
        ...decoded.restaurant,
        is_active: true,
        picture: {
          create: {
            ...decoded.restaurant.picture,
          },
        },
      },
      include: {
        picture: true,
      },
    });

    return { message: 'Restaurant activated successfully' };
  }

  async loginRestaurant(
    loginDto: RestaurantLoginDto,
    res: Response,
  ): Promise<RestaurantLoginResponse> {
    const { email, password } = loginDto;

    const resData = (await this.prisma.restaurant.findUnique({
      where: {
        email,
      },
      include: {
        picture: true,
      },
    })) as unknown as Restaurant;

    if (!resData) {
      throw new BadRequestException('Restaurant not found');
    }

    const isPasswordCorrect = await this.bcryptGenerater.comparePassword(
      password,
      resData.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }
    const { password: pass, ...restaurant } = resData;

    const { accessToken, refreshToken } =
      await this.sendToken.createRestaurantToken(restaurant as any);

    // Tokenlarni cookie'ga saqlash
    res.cookie('access_token_restaurant', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
      maxAge: 1000 * 60 * 30, // 30 minutes
    });

    res.cookie('refresh_token_restaurant', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // localda false bo'lishi kerak
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CORS uchun
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    });

    return { restaurant };
  }

  async getLoggedInRestaurant(req: Request) {
    const restaurant = (req as any).restaurant;
    return {
      restaurant,
    };
  }

  async logoutRestaurant(req: any) {
    req.headers.refresh_token = '';
    req.headers.access_token = '';
    return { message: 'Restaurant logged out successfully' };
  }
}

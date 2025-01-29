import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SendToken } from './utils/sendToken'; // sizda bor klass

@Controller('auth')
export class SocialAuthController {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // ---------------- Google ----------------
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Bu yerda hech narsa qilmaymiz, faqat Google'ga redirect bo'ladi
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // PassportStrategy ichidagi validate() da req.user shakllangan bo'ladi
    const user = req.user as any;

    // Sizning sendToken helper'ingizdan foydalanamiz:
    const tokenSender = new SendToken(this.jwtService, this.configService);
    const { accessToken, refreshToken } = await tokenSender.sendToken(user);

    // Endi front-end'ga redirect qilamiz, tokenlarni query yoki state orqali jo'natish mumkin
    // Yoki cookie'ga set qilib yuborish mumkin:
    // res.cookie('accessToken', accessToken, { httpOnly: true, ... });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, ... });

    // Masalan, front saytingiz URL manziliga token bilan redirect qilish:
    const clientUrl = this.configService.get<string>('CLIENT_SITE_URL');
    return res.redirect(
      `${clientUrl}/social-login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  // ---------------- G ----------------
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // Bu ham shunchaki Github'ka redirect bo'ladi
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const tokenSender = new SendToken(this.jwtService, this.configService);
    const { accessToken, refreshToken } = await tokenSender.sendToken(user);

    const clientUrl = this.configService.get<string>('CLIENT_SITE_URL');
    return res.redirect(
      `${clientUrl}/social-login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}

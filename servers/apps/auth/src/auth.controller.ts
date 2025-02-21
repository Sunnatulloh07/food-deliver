import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SendToken } from '@app/utils';
import { AuthUserService } from './users/auth.user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: AuthUserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // ---------------- Google ----------------
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;

    const tokenSender = new SendToken(this.jwtService, this.configService);
    const { accessToken, refreshToken } = await tokenSender.sendToken(user);

    const clientUrl = this.configService.get<string>('CLIENT_SITE_URL');
    return res.redirect(
      `${clientUrl}/social-login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  // ---------------- Github ----------------
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

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

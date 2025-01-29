import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { sub, email, name, picture } = profile._json;

      // Bizning UsersService ichidagi validateOAuthUser metodidan foydalanamiz:
      const user = await this.usersService.validateOAuthUser({
        provider: profile.provider,
        social_id: sub,
        email,
        name: name,
        picture: picture,
      });

      // done() -> Passport'ga user ma'lumotini uzatish
      return done(null, user);
    } catch (err) {
      // Xatolik bo'lsa
      return done(err, false);
    }
  }
}

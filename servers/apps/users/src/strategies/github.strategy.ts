import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'], // GitHub email'ni olish uchun
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile & { _json: any },
    done: (error: any, user: any) => void,
  ): Promise<any> {
    try {
      const { id, emails, displayName, username, provider } = profile;


      let email: string | null = null;
      if (emails && emails.length > 0) {
        email = emails[0].value;
      }

      const name = displayName || username || 'NoName';
      const picture = profile._json?.avatar_url || profile.photos[0].value;
      const user = await this.usersService.validateOAuthUser({
        provider,
        social_id: id,
        email,
        name,
        picture,
      });

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}

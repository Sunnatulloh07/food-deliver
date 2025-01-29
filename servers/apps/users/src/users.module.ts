import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserResolver } from './users.resolver';
import { EmailModule } from './email/email.module';
import { BcryptGenerater } from './utils/bcryptGenerater';
import { PassportModule } from '@nestjs/passport';
import { SocialAuthController } from './social-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SocialAuthController],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    UserResolver,
    BcryptGenerater,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class UsersModule {}

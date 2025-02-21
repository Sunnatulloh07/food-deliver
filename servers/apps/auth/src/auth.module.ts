import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { EmailModule } from '@app/email';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUserService } from './users/auth.user.service';
import { Request, Response } from 'express';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { BcryptGenerater, SendToken } from '@app/utils';
import { AuthUserResolver } from './users/auth.user.resolver';
import { AuthRestaurantService } from './restaurants/auth.restaurant.service';
import { AuthRestaurantResolver } from './restaurants/auth.restaurant.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloFederationDriver,
      useFactory: () => ({
        autoSchemaFile: {
          federation: 2,
        },
        cors: true,
        playground: true,
        introspection: true,
        context: ({ req, res }): { req: Request; res: Response } => ({ req, res }),
      }),
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthUserService,
    AuthRestaurantService,
    ConfigService,
    JwtService,
    PrismaService,
    AuthRestaurantResolver,
    AuthUserResolver,
    BcryptGenerater,
    SendToken,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}

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
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '@app/email';
import { BcryptGenerater, SendToken } from '@app/utils';
import { Request, Response } from 'express';

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
      playground: true,
      introspection: true,
      context: ({ req, res }): { req: Request; res: Response } => ({
        req,
        res,
      }),
    }),
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    UserResolver,
    BcryptGenerater,
    SendToken,
    JwtService,
    ConfigService,
  ],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloFederationDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { EmailModule } from '@app/email';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RestaurantResolver } from './restaurants.resolver';
import { BcryptGenerater, SendToken } from '@app/utils';
import { Request, Response } from 'express';
import { FoodsService } from './foods/food.service';
import { FoodResolver } from './foods/food.resolver';

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
  ],
  providers: [
    RestaurantsService,
    ConfigService,
    JwtService,
    PrismaService,
    RestaurantResolver,
    BcryptGenerater,
    SendToken,
    FoodsService,
    FoodResolver,
  ],
})
export class RestaurantsModule {}

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import {
  GraphQLDataSourceProcessOptions,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from '@apollo/gateway';
import { Request, Response } from 'express';
import type { GatewayGraphQLRequestContext } from '@apollo/server-gateway-interface';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloGatewayDriver,
      useFactory:() => ({
        server: {
          playground: true,
          introspection: true,
          context: ({ req, res }) => {
            return { req, res };
          },
          cors:true
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'restaurants', url: 'http://localhost:4002/graphql' },
              { name: 'users', url: 'http://localhost:4001/graphql' },
              { name: 'auth', url: 'http://localhost:4003/graphql' },
            ],
          }),
          buildService: ({ url }) => {
            return new CookieDataSource({ url });
          },
        },
      })
    }),
  ],
})
export class AppModule {}

// cookie manege 
class CookieDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    // Client -> Gateway -> Subgraph cookie o'tqazish
    if (context?.req?.cookies) {
      request.http.headers.set('cookie', context.req.headers.cookie || '');
    }
  }

  async didReceiveResponse({ response, context }) {
    const setCookieHeaders = response.http.headers.raw()["set-cookie"]; // Cookie-larni butun formatda olamiz
    if (setCookieHeaders && context?.res) {
      // `set-cookie` array bo‘lsa, uni o‘z holicha ishlatamiz
      const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  
      cookies.forEach((cookie: string) => {
        // Cookie nomini ajratib olamiz (birinchi qism)
        const cookieName = cookie.split("=")[0]?.trim();
  
        // Agar cookie nomi mavjud bo‘lsa, uni uzatamiz
        if (cookieName && cookieName !== "") {
          context.res.append("set-cookie", cookie);
        }
      });
    }
  
    return response;
  }
  
  
  
}

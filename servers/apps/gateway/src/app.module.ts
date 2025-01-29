import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:4001/graphql' },
            // { name: 'orders', url: 'http://localhost:4002/graphql' },
            // { name: 'restaurants', url: 'http://localhost:4003/graphql' },
            // { name: 'foods', url: 'http://localhost:4004/graphql' },
            // { name: 'reviews', url: 'http://localhost:4005/graphql' },
            // { name: 'payments', url: 'http://localhost:4006/graphql' },
            // { name: 'deliveries', url: 'http://localhost:4007/graphql' },
          ],
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { CryptoModule } from '@/crypto/crypto.module';
import mikroOrmConfig from '@/mikro-orm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    CryptoModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      graphiql: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

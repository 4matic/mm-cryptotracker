import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from '@/app/app.controller';
import { AppService } from '@/app/app.service';
import { CryptoModule } from '@/crypto/crypto.module';
// import mikroOrmConfig from '@/mikro-orm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLApiModule } from '@/crypto/graphql/graphql.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      dbName: process.env.DATABASE_NAME,
      debug: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),
    CryptoModule,
    GraphQLApiModule,
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

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CryptoModule } from '@/app/crypto/crypto.module';
import { PriceFetchingModule } from '@/app/price-fetching/price-fetching.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLApiModule } from '@/app/crypto/graphql/graphql.module';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig, { DatabaseConfig } from '@/config/database.config';
import appConfig, { AppConfig } from '@/config/app.config';
import dataProviderConfig from '@/config/data-provider.config';
import { AppController } from '@/app/controllers/app.controller';
import { AppService } from '@/app/services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig, dataProviderConfig],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }
        return {
          driver: PostgreSqlDriver,
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          dbName: dbConfig.dbName,
          debug: dbConfig.debug,
          autoLoadEntities: true,
        };
      },
    }),
    CryptoModule,
    PriceFetchingModule,
    GraphQLApiModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfigData = configService.get<AppConfig>('app');
        if (!appConfigData) {
          throw new Error('App configuration not found');
        }
        return {
          debug: !appConfigData.isProduction,
          graphiql: !appConfigData.isProduction,
          autoSchemaFile: true,
          sortSchema: true,
        };
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

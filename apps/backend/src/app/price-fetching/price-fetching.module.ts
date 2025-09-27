import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  DataProvider,
  TradingPair,
  PriceHistory,
  Asset,
} from '@/app/crypto/entities';
import { PriceFetchingService } from './services/price-fetching.service';
import { PriceFetchingController } from './controllers/price-fetching.controller';
import { ConfigModule } from '@nestjs/config';

/**
 * Module for price fetching functionality
 * Handles fetching cryptocurrency prices from external data providers
 * and storing them in the database
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 3,
    }),
    MikroOrmModule.forFeature([DataProvider, TradingPair, PriceHistory, Asset]),
    ConfigModule,
  ],
  controllers: [PriceFetchingController],
  providers: [PriceFetchingService],
  exports: [PriceFetchingService],
})
export class PriceFetchingModule {}

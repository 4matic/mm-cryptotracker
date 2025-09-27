import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  Asset,
  TradingPair,
  DataProvider,
  PriceHistory,
} from '@/app/crypto/entities';
import { AssetService } from '@/app/crypto/services/asset.service';
import { TradingPairService } from '@/app/crypto/services/trading-pair.service';
import { DataProviderService } from '@/app/crypto/services/data-provider.service';
import { PriceHistoryService } from '@/app/crypto/services/price-history.service';
import { PriceCalculationService } from '@/app/crypto/services/price-calculation.service';
import { AssetController } from '@/app/crypto/controllers/asset.controller';
import { TradingPairController } from '@/app/crypto/controllers/trading-pair.controller';
import { PriceHistoryController } from '@/app/crypto/controllers/price-history.controller';
import { DataProviderController } from '@/app/crypto/controllers/data-provider.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Asset, TradingPair, DataProvider, PriceHistory]),
  ],
  controllers: [
    AssetController,
    TradingPairController,
    PriceHistoryController,
    DataProviderController,
  ],
  providers: [
    AssetService,
    TradingPairService,
    DataProviderService,
    PriceHistoryService,
    PriceCalculationService,
  ],
  exports: [
    AssetService,
    TradingPairService,
    DataProviderService,
    PriceHistoryService,
    PriceCalculationService,
  ],
})
export class CryptoModule {}

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Asset, TradingPair, DataProvider, PriceHistory } from '@/entities';
import { AssetService } from '@/crypto/services/asset.service';
import { TradingPairService } from '@/crypto/services/trading-pair.service';
import { DataProviderService } from '@/crypto/services/data-provider.service';
import { PriceHistoryService } from '@/crypto/services/price-history.service';
import { PriceCalculationService } from '@/crypto/services/price-calculation.service';
import { AssetController } from '@/crypto/controllers/asset.controller';
import { TradingPairController } from '@/crypto/controllers/trading-pair.controller';
import { PriceHistoryController } from '@/crypto/controllers/price-history.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Asset, TradingPair, DataProvider, PriceHistory]),
  ],
  controllers: [AssetController, TradingPairController, PriceHistoryController],
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

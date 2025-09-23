import { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PriceHistory } from '@/entities/price-history.entity';
import { TradingPair } from '@/entities/trading-pair.entity';
import { DataProvider } from '@/entities/data-provider.entity';

interface TradingPairWithPriceData {
  pair: TradingPair;
  priceData: {
    currentPrice: string;
    volume24h: string;
    priceChangePercentage24h: string;
    lastUpdated: string;
  };
}

/**
 * Seeds price history data using trading pairs and data providers from context
 */
export class PriceHistorySeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const tradingPairsWithPriceData =
      context.tradingPairsWithPriceData as TradingPairWithPriceData[];
    const dataProvider = context.dataProvider as DataProvider;

    if (!tradingPairsWithPriceData || !dataProvider) {
      throw new Error(
        'Missing trading pairs or data provider in context. Make sure TradingPairSeeder and DataProviderSeeder run first.'
      );
    }

    for (const { pair, priceData } of tradingPairsWithPriceData) {
      const timestamp = new Date(priceData.lastUpdated);

      // Check if price history entry already exists
      const existingEntry = await em.findOne(PriceHistory, {
        tradingPair: pair,
        dataProvider: dataProvider,
        timestamp: timestamp,
      });

      if (!existingEntry) {
        // Create price history entry
        const priceHistory = new PriceHistory(
          pair,
          dataProvider,
          timestamp,
          priceData.currentPrice
        );

        em.persist(priceHistory);
      }
    }

    await em.flush();
  }
}

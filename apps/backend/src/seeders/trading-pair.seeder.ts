import { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Asset } from '@/entities/asset.entity';
import { TradingPair } from '@/entities/trading-pair.entity';
import * as fs from 'fs';
import * as path from 'path';

interface TradingPairData {
  baseAsset: {
    symbol: string;
    name: string;
  };
  quoteAsset: {
    symbol: string;
    name: string;
  };
  currentPrice: string;
  volume24h: string;
  priceChangePercentage24h: string;
  lastUpdated: string;
}

/**
 * Seeds trading pairs from JSON data file
 */
export class TradingPairSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // Load trading pairs data from JSON file
    const dataPath = path.join(__dirname, './data/trading-pairs.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    const tradingPairsData: TradingPairData[] = JSON.parse(jsonData);

    const tradingPairs: Array<{
      pair: TradingPair;
      priceData: TradingPairData;
    }> = [];

    for (const pairData of tradingPairsData) {
      // Find or create base asset
      let baseAsset = await em.findOne(Asset, {
        symbol: pairData.baseAsset.symbol,
      });
      if (!baseAsset) {
        baseAsset = new Asset(
          pairData.baseAsset.symbol,
          pairData.baseAsset.name
        );
        em.persist(baseAsset);
      }

      // Find or create quote asset
      let quoteAsset = await em.findOne(Asset, {
        symbol: pairData.quoteAsset.symbol,
      });
      if (!quoteAsset) {
        quoteAsset = new Asset(
          pairData.quoteAsset.symbol,
          pairData.quoteAsset.name
        );
        if (pairData.quoteAsset.symbol === 'USD') {
          quoteAsset.isFiat = true;
        }
        em.persist(quoteAsset);
      }

      // Check if trading pair already exists
      const existingPair = await em.findOne(TradingPair, {
        baseAsset: baseAsset,
        quoteAsset: quoteAsset,
      });

      if (!existingPair) {
        // Create new trading pair without price data
        const tradingPair = new TradingPair(baseAsset, quoteAsset);
        em.persist(tradingPair);

        // Save to context with price data for PriceHistorySeeder
        tradingPairs.push({ pair: tradingPair, priceData: pairData });
      } else {
        // If pair exists, still add to context for price history
        tradingPairs.push({ pair: existingPair, priceData: pairData });
      }
    }

    await em.flush();

    // Save trading pairs with their price data to context
    context.tradingPairsWithPriceData = tradingPairs;
  }
}

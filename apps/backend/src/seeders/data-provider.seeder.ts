import { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { DataProvider } from '@/entities/data-provider.entity';
import { DataProviderSlug } from '@/enums/data-provider.enum';

/**
 * Seeds initial data provider: CoinMarketCap
 */
export class DataProviderSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // Check if CoinMarketCap provider already exists
    let existingProvider = await em.findOne(DataProvider, {
      name: 'CoinMarketCap',
    });

    if (!existingProvider) {
      const coinMarketCap = new DataProvider(
        DataProviderSlug.Coinmarketcap,
        'CoinMarketCap',
        'Leading cryptocurrency market capitalization and pricing data provider'
      );
      coinMarketCap.apiUrl = 'https://pro-api.coinmarketcap.com';
      coinMarketCap.website = 'https://coinmarketcap.com';
      coinMarketCap.rateLimitPerMinute = 1800; // Basic plan limit
      coinMarketCap.priority = 1;
      coinMarketCap.apiConfig = {
        apiKey: process.env.CMC_API_KEY,
      };

      em.persist(coinMarketCap);
      await em.flush();
      existingProvider = coinMarketCap;
    }

    // Save data provider to context for PriceHistorySeeder
    context.dataProvider = existingProvider;
  }
}

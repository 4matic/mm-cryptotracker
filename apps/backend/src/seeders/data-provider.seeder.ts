import { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { DataProvider } from '@/app/crypto/entities/data-provider.entity';
import { DataProviderSlug } from '@/enums/data-provider.enum';
import seederConfig from '@/config/seeder.config';

/**
 * Seeds initial data provider: CoinMarketCap
 */
export class DataProviderSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const config = seederConfig();

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

      if (config.coinMarketCapApiKey) {
        coinMarketCap.apiConfig = {
          apiKey: config.coinMarketCapApiKey,
        };
      } else {
        console.log(
          'ℹ️  CoinMarketCap API key not provided - the system will run in demo mode with limited functionality. Real-time price updates will not be available.'
        );
        coinMarketCap.apiConfig = {};
      }

      em.persist(coinMarketCap);
      await em.flush();
      existingProvider = coinMarketCap;
    }

    // Save data provider to context for PriceHistorySeeder
    context.dataProvider = existingProvider;
  }
}

import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const dataProviderConfigSchema = z.object({
  /**
   * @description Interval in milliseconds between data fetching operations
   * @default 300000 (5 minutes)
   * @example 300000 // 5 minutes
   * @see PriceFetchingService
   */
  fetchIntervalMs: z.coerce.number().int().positive().default(300000),
  /**
   * @description CoinMarketCap API key for fetching cryptocurrency data
   * @remarks Optional field as it can be configured in the database instead of environment variables
   * @remarks Used primarily in the data provider seeder for initial setup
   * @example "your-coinmarketcap-api-key"
   * @see DataProviderSeeder
   */
  coinMarketCapApiKey: z.string().optional(),
});

export type DataProviderConfig = z.infer<typeof dataProviderConfigSchema>;

export default registerAs('dataProvider', () => {
  const config = {
    fetchIntervalMs: process.env.DATA_PROVIDER_FETCH_INTERVAL_MS,
    coinMarketCapApiKey: process.env.DATA_PROVIDER_COINMARKETCAP_API_KEY,
  };

  return dataProviderConfigSchema.parse(config);
});

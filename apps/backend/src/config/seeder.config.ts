import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const seederConfigSchema = z.object({
  /**
   * @description Public URL for serving static assets, used in asset seeders
   * @remarks Must be a valid URL format
   * @example "https://cdn.example.com"
   * @see AssetSeeder
   */
  assetsPublicUrl: z.url({
    error: 'ASSETS_PUBLIC_URL is required and must be a valid URL',
  }),
  /**
   * @description CoinMarketCap API key for data provider seeder
   * @remarks Used to configure the data provider during seeding
   * @example "your-coinmarketcap-api-key"
   * @see DataProviderSeeder
   */
  coinMarketCapApiKey: z
    .string()
    .min(1, 'DATA_PROVIDER_COINMARKETCAP_API_KEY is required'),
});

export type SeederConfig = z.infer<typeof seederConfigSchema>;

export default registerAs('seeder', () => {
  const config = {
    assetsPublicUrl: process.env.ASSETS_PUBLIC_URL,
    coinMarketCapApiKey: process.env.DATA_PROVIDER_COINMARKETCAP_API_KEY,
  };

  return seederConfigSchema.parse(config);
});

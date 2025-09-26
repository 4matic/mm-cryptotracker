import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const dataProviderConfigSchema = z.object({
  fetchIntervalMs: z.coerce.number().int().positive().default(300000),
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

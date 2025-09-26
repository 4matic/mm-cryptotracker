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
});

export type DataProviderConfig = z.infer<typeof dataProviderConfigSchema>;

export default registerAs('dataProvider', () => {
  const config = {
    fetchIntervalMs: process.env.DATA_PROVIDER_FETCH_INTERVAL_MS,
  };

  return dataProviderConfigSchema.parse(config);
});

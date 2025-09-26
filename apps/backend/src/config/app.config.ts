import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().int().positive().default(4000),
  nestDebug: z.coerce.boolean().default(false),
  assetsPublicUrl: z.url({
    error: 'ASSETS_PUBLIC_URL is required and must be a valid URL',
  }),
  isProduction: z.boolean(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export default registerAs('app', () => {
  const nodeEnv = process.env.NODE_ENV as AppConfig['nodeEnv'];
  const config = {
    nodeEnv,
    port: process.env.PORT,
    nestDebug: process.env.NEST_DEBUG,
    assetsPublicUrl: process.env.ASSETS_PUBLIC_URL,
    isProduction: nodeEnv === 'production',
  };

  return appConfigSchema.parse(config);
});

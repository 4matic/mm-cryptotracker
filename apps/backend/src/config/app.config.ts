import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appConfigSchema = z.object({
  /**
   * @description Node.js environment mode
   * @default "development"
   * @example "production"
   */
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  /**
   * @description Port number on which the application server will listen
   * @default 4000
   * @example 3000
   */
  port: z.coerce.number().int().positive().default(4000),
  /**
   * @description Enable debug mode for NestJS framework
   * @default false
   * @example true
   */
  nestDebug: z.coerce.boolean().default(false),
  /**
   * @description Computed boolean indicating if the application is running in production mode
   * @remarks Derived from nodeEnv property
   * @example true
   */
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

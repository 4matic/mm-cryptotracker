import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  host: z.string().min(1, 'DATABASE_HOST is required'),
  port: z.coerce.number().int().positive().default(5432),
  user: z.string().min(1, 'DATABASE_USER is required'),
  password: z.string().min(1, 'DATABASE_PASSWORD is required'),
  dbName: z.string().min(1, 'DATABASE_NAME is required'),
  debug: z.coerce.boolean().default(false),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

export default registerAs('database', () => {
  const config = {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
    debug: process.env.NODE_ENV !== 'production',
  };

  return databaseConfigSchema.parse(config);
});

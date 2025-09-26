import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  /**
   * @description Database server hostname or IP address
   * @remarks Required field - cannot be empty
   * @example "localhost"
   */
  host: z.string().min(1, 'DATABASE_HOST is required'),
  /**
   * @description Database server port number
   * @default 5432
   * @example 5432
   */
  port: z.coerce.number().int().positive().default(5432),
  /**
   * @description Database username for authentication
   * @remarks Required field - cannot be empty
   * @example "postgres"
   */
  user: z.string().min(1, 'DATABASE_USER is required'),
  /**
   * @description Database password for authentication
   * @remarks Required field - cannot be empty
   * @example "secretpassword"
   */
  password: z.string().min(1, 'DATABASE_PASSWORD is required'),
  /**
   * @description Name of the database to connect to
   * @remarks Required field - cannot be empty
   * @example "cryptotracker"
   */
  dbName: z.string().min(1, 'DATABASE_NAME is required'),
  /**
   * @description Enable database query debugging and logging
   * @default false
   * @remarks Automatically disabled in production environment
   * @example true
   */
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

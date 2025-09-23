import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { config } from 'dotenv';
import { join } from 'path';
import { register } from 'tsconfig-paths';

// Register TypeScript path aliases
// register({
//   baseUrl: join(__dirname, ''),
//   paths: {
//     '@/*': ['src/*'],
//   },
// });

// Load environment variables from .env file
config({ path: join(__dirname, '../.env') });

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  entities: ['apps/backend/dist/**/*.entity.js'],
  entitiesTs: ['apps/backend/src/**/*.entity.ts'],
  discovery: {
    warnWhenNoEntities: true,
  },
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: 'apps/backend/dist/migrations',
    pathTs: 'apps/backend/src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  extensions: [Migrator],
  preferTs: true,
});

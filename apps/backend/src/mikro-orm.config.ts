import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  extensions: [Migrator],
});

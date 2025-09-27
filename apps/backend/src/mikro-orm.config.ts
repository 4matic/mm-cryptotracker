import 'reflect-metadata';
import { join } from 'path';
import { register } from 'tsconfig-paths';
// Register tsconfig paths for alias resolution
register({
  baseUrl: join(__dirname, '..'),
  paths: {
    '@/*': ['src/*'],
  },
});

import { config } from 'dotenv';
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

import { Asset } from '@/app/crypto/entities/asset.entity';
import { TradingPair } from '@/app/crypto/entities/trading-pair.entity';
import { PriceHistory } from '@/app/crypto/entities/price-history.entity';
import { DataProvider } from '@/app/crypto/entities/data-provider.entity';

config({ path: join(__dirname, '../.env') });

// Configure ts-node for proper decorator support
// process.env.TS_NODE_PROJECT = join(__dirname, '../tsconfig.app.json');

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST,
  metadataProvider: ReflectMetadataProvider,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  entities: [Asset, TradingPair, PriceHistory, DataProvider],
  // entitiesTs: ['./src/app/crypto/entities/*.entity.ts'],
  discovery: {
    warnWhenNoEntities: true,
    requireEntitiesArray: false,
    alwaysAnalyseProperties: true,
  },
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  seeder: {
    path: './src/seeders',
    glob: '!(*.d).{js,ts}',
    defaultSeeder: 'DatabaseSeeder',
  },
  extensions: [Migrator, SeedManager],
  // preferTs: true,
});

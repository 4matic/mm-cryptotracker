import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { AssetSeeder } from './asset.seeder';
import { DataProviderSeeder } from './data-provider.seeder';
import { TradingPairSeeder } from './trading-pair.seeder';
import { PriceHistorySeeder } from './price-history.seeder';

/**
 * Main database seeder that runs all seeders in the correct order
 */
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Run seeders in dependency order with shared context
    // 1. Assets must be created first (no dependencies)
    // 2. DataProviders must be created before PriceHistory
    // 3. TradingPairs depend on Assets
    // 4. PriceHistory depends on TradingPairs and DataProviders
    await this.call(em, [
      AssetSeeder,
      DataProviderSeeder,
      TradingPairSeeder,
      PriceHistorySeeder,
    ]);
  }
}

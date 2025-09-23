import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Asset } from '@/entities/asset.entity';

/**
 * Seeds initial assets: USDT and TON
 */
export class AssetSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if assets already exist
    const existingAssets = await em.find(Asset, {
      symbol: { $in: ['USD', 'USDT', 'TON'] },
    });

    const existingSymbols = existingAssets.map((asset) => asset.symbol);

    // Create USD if it doesn't exist
    if (!existingSymbols.includes('USD')) {
      const usd = new Asset(
        'USD',
        'United States Dollar',
        'United States Dollar is the official currency of the United States'
      );
      usd.logoUrl =
        'https://upload.wikimedia.org/wikipedia/commons/1/14/Dollar_Sign.svg';
      usd.isFiat = true;
      em.persist(usd);
    }

    // Create USDT if it doesn't exist
    if (!existingSymbols.includes('USDT')) {
      const usdt = new Asset(
        'USDT',
        'Tether',
        'Tether is a stablecoin cryptocurrency pegged to the US Dollar'
      );
      usdt.logoUrl = 'https://cryptologos.cc/logos/tether-usdt-logo.png';
      usdt.website = 'https://tether.to/';
      em.persist(usdt);
    }

    // Create TON if it doesn't exist
    if (!existingSymbols.includes('TON')) {
      const ton = new Asset(
        'TON',
        'Toncoin',
        'Toncoin is the native cryptocurrency of The Open Network blockchain'
      );
      ton.logoUrl = 'https://cryptologos.cc/logos/toncoin-ton-logo.png';
      ton.website = 'https://ton.org/';
      em.persist(ton);
    }

    await em.flush();
  }
}

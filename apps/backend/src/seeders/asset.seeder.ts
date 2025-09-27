import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Asset } from '@/app/crypto/entities/asset.entity';
import seederConfig from '@/config/seeder.config';

/**
 * Seeds initial assets: USDT and TON
 */
export class AssetSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const config = seederConfig();
    const assetsPublicUrl = config.assetsPublicUrl;

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
      usd.logoUrl = `${assetsPublicUrl}/images/dollar-sign.svg`;
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
      usdt.logoUrl = `${assetsPublicUrl}/images/tether-usdt-logo.svg`;
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
      ton.logoUrl = `${assetsPublicUrl}/images/toncoin-ton-logo.svg`;
      ton.website = 'https://ton.org/';
      em.persist(ton);
    }

    await em.flush();
  }
}

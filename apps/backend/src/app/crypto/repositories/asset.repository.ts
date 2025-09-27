import { EntityRepository } from '@mikro-orm/postgresql';
import { Asset } from '@/app/crypto/entities/asset.entity';

/**
 * Custom repository for Asset entity
 */
export class AssetRepository extends EntityRepository<Asset> {}

import { EntityRepository } from '@mikro-orm/postgresql';
import { PriceHistory } from '@/app/crypto/entities/price-history.entity';

/**
 * Custom repository for PriceHistory entity
 */
export class PriceHistoryRepository extends EntityRepository<PriceHistory> {}

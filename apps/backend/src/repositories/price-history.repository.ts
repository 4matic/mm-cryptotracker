import { EntityRepository } from '@mikro-orm/postgresql';
import { PriceHistory } from '@/entities/price-history.entity';

/**
 * Custom repository for PriceHistory entity
 */
export class PriceHistoryRepository extends EntityRepository<PriceHistory> {}

import { EntityRepository } from '@mikro-orm/postgresql';
import { TradingPair } from '@/entities/trading-pair.entity';

/**
 * Custom repository for TradingPair entity
 */
export class TradingPairRepository extends EntityRepository<TradingPair> {}

import { EntityRepository } from '@mikro-orm/postgresql';
import { DataProvider } from '@/entities/data-provider.entity';

/**
 * Custom repository for DataProvider entity
 */
export class DataProviderRepository extends EntityRepository<DataProvider> {}

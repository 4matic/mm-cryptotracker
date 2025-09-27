import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EnsureRequestContext } from '@mikro-orm/core';
import { DataProvider } from '@/app/crypto/entities/data-provider.entity';
import { DataProviderRepository } from '@/app/crypto/repositories';

/**
 * Service for managing data providers
 */
@Injectable()
export class DataProviderService {
  constructor(
    @InjectRepository(DataProvider)
    private readonly dataProviderRepository: DataProviderRepository,
    private readonly em: EntityManager
  ) {}

  /**
   * Creates a new data provider
   */
  async createDataProvider(
    name: string,
    description?: string
  ): Promise<DataProvider> {
    const dataProvider = new DataProvider(name, description || '');
    await this.em.persistAndFlush(dataProvider);
    return dataProvider;
  }

  /**
   * Finds a data provider by name
   */
  @EnsureRequestContext()
  async findByName(name: string): Promise<DataProvider | null> {
    return this.dataProviderRepository.findOne({ name });
  }

  /**
   * Finds a data provider by slug
   */
  async findBySlug(slug: string): Promise<DataProvider | null> {
    return this.dataProviderRepository.findOne({ slug });
  }

  /**
   * Finds a data provider by ID
   */
  @EnsureRequestContext()
  async findById(id: number): Promise<DataProvider | null> {
    return this.dataProviderRepository.findOne(id);
  }

  /**
   * Gets all active data providers
   */
  @EnsureRequestContext()
  async findAllActive(): Promise<DataProvider[]> {
    return this.dataProviderRepository.find(
      { isActive: true },
      { orderBy: { priority: 'DESC', name: 'ASC' } }
    );
  }

  /**
   * Gets data providers with pagination
   */
  async findWithPagination(
    page = 1,
    limit = 20,
    activeOnly = true
  ): Promise<{ dataProviders: DataProvider[]; total: number }> {
    const whereCondition = activeOnly ? { isActive: true } : {};

    const [dataProviders, total] =
      await this.dataProviderRepository.findAndCount(whereCondition, {
        orderBy: { priority: 'DESC', name: 'ASC' },
        limit,
        offset: (page - 1) * limit,
      });

    return { dataProviders, total };
  }

  /**
   * Updates a data provider
   */
  async updateDataProvider(
    id: number,
    updateData: Partial<DataProvider>
  ): Promise<DataProvider | null> {
    const dataProvider = await this.dataProviderRepository.findOne(id);
    if (!dataProvider) {
      return null;
    }

    this.em.assign(dataProvider, updateData);
    await this.em.flush();
    return dataProvider;
  }

  /**
   * Deactivates a data provider
   */
  async deactivateDataProvider(id: number): Promise<boolean> {
    const dataProvider = await this.dataProviderRepository.findOne(id);
    if (!dataProvider) {
      return false;
    }

    dataProvider.isActive = false;
    await this.em.flush();
    return true;
  }
}

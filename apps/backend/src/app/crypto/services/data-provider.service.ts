import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  EntityManager,
  EnsureRequestContext,
} from '@mikro-orm/core';
import { DataProvider } from '@/entities/data-provider.entity';

/**
 * Service for managing data providers
 */
@Injectable()
export class DataProviderService {
  constructor(
    @InjectRepository(DataProvider)
    private readonly dataProviderRepository: EntityRepository<DataProvider>,
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
  async findByName(name: string): Promise<DataProvider | null> {
    return this.dataProviderRepository.findOne({ name });
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
  async findAllActive(): Promise<DataProvider[]> {
    return this.dataProviderRepository.find(
      { isActive: true },
      { orderBy: { priority: 'DESC', name: 'ASC' } }
    );
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

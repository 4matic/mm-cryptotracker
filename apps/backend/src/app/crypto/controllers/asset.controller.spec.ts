import { Test, TestingModule } from '@nestjs/testing';

// Mock MikroORM core to prevent circular dependency issues
jest.mock('@mikro-orm/core', () => {
  const actual = jest.requireActual('@mikro-orm/core');
  return {
    ...actual,
    EnsureRequestContext:
      () =>
      (
        target: unknown,
        propertyKey: string,
        descriptor: PropertyDescriptor
      ) => {
        // Return the original method without context wrapping for tests
        return descriptor;
      },
  };
});

// Mock the entity imports to prevent circular dependency
jest.mock('@/app/crypto/entities/asset.entity', () => ({
  Asset: class MockAssetClass {},
}));

jest.mock('@/app/crypto/entities/trading-pair.entity', () => ({
  TradingPair: class MockTradingPairClass {},
}));

import { AssetController } from './asset.controller';
import { AssetService } from '@/app/crypto/services/asset.service';

// Define mock Asset interface for testing without importing the actual entity
interface MockAsset {
  id: number;
  symbol: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  isFiat: boolean;
  createdAt: Date;
  updatedAt: Date;
}

describe('AssetController', () => {
  let controller: AssetController;
  let mockAssetService: Partial<AssetService>;

  // Sample test data
  const mockAsset: MockAsset = {
    id: 1,
    symbol: 'BTC',
    name: 'Bitcoin',
    description: 'Test cryptocurrency',
    logoUrl: undefined,
    website: undefined,
    isActive: true,
    isFiat: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAssets: MockAsset[] = [mockAsset];

  beforeAll(async () => {
    // Create mock service with all required methods
    mockAssetService = {
      findWithPagination: jest.fn(),
      findById: jest.fn(),
      findBySymbol: jest.fn(),
    };

    // Create testing module with controller and mocked service
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
      ],
    }).compile();

    controller = app.get<AssetController>(AssetController);
  });

  describe('getAssets', () => {
    it('should return paginated assets with default parameters', async () => {
      // Arrange - setup mock return value
      const expectedResult = {
        assets: mockAssets,
        total: 1,
      };
      (mockAssetService.findWithPagination as jest.Mock).mockResolvedValue(
        expectedResult
      );

      // Act - call the method
      const result = await controller.getAssets();

      // Assert - verify the response
      expect(result).toEqual({
        assets: mockAssets,
        total: 1,
        page: 1,
        limit: 20,
      });
      expect(mockAssetService.findWithPagination).toHaveBeenCalledWith(1, 20);
    });

    it('should return paginated assets with custom parameters', async () => {
      // Arrange - setup mock return value
      const expectedResult = {
        assets: mockAssets,
        total: 1,
      };
      (mockAssetService.findWithPagination as jest.Mock).mockResolvedValue(
        expectedResult
      );

      // Act - call the method with custom parameters
      const result = await controller.getAssets(2, 10);

      // Assert - verify the response includes custom parameters
      expect(result).toEqual({
        assets: mockAssets,
        total: 1,
        page: 2,
        limit: 10,
      });
      expect(mockAssetService.findWithPagination).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('getAssetById', () => {
    it('should return asset when found', async () => {
      // Arrange - setup mock to return asset
      (mockAssetService.findById as jest.Mock).mockResolvedValue(mockAsset);

      // Act - call the method
      const result = await controller.getAssetById(1);

      // Assert - verify correct asset is returned
      expect(result).toEqual(mockAsset);
      expect(mockAssetService.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when asset not found', async () => {
      // Arrange - setup mock to return null
      (mockAssetService.findById as jest.Mock).mockResolvedValue(null);

      // Act - call the method
      const result = await controller.getAssetById(999);

      // Assert - verify null is returned
      expect(result).toBeNull();
      expect(mockAssetService.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('getAssetBySymbol', () => {
    it('should return asset when found by symbol', async () => {
      // Arrange - setup mock to return asset
      (mockAssetService.findBySymbol as jest.Mock).mockResolvedValue(mockAsset);

      // Act - call the method
      const result = await controller.getAssetBySymbol('BTC');

      // Assert - verify correct asset is returned
      expect(result).toEqual(mockAsset);
      expect(mockAssetService.findBySymbol).toHaveBeenCalledWith('BTC');
    });

    it('should return null when asset not found by symbol', async () => {
      // Arrange - setup mock to return null
      (mockAssetService.findBySymbol as jest.Mock).mockResolvedValue(null);

      // Act - call the method
      const result = await controller.getAssetBySymbol('UNKNOWN');

      // Assert - verify null is returned
      expect(result).toBeNull();
      expect(mockAssetService.findBySymbol).toHaveBeenCalledWith('UNKNOWN');
    });
  });
});

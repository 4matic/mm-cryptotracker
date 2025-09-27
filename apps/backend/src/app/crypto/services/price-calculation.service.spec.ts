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
// Each entity needs a unique constructor function for getRepositoryToken to work correctly
jest.mock('@/app/crypto/entities/trading-pair.entity', () => ({
  TradingPair: class MockTradingPairClass {},
}));

jest.mock('@/app/crypto/entities/price-history.entity', () => ({
  PriceHistory: class MockPriceHistoryClass {
    tradingPair: unknown;
    dataProvider: unknown;
    timestamp: Date;
    price: string;
    lastUpdated?: Date;
    createdAt: Date;
    metadata?: Record<string, unknown>;

    constructor(
      tradingPair: unknown,
      dataProvider: unknown,
      timestamp: Date,
      price: string
    ) {
      this.tradingPair = tradingPair;
      this.dataProvider = dataProvider;
      this.timestamp = timestamp;
      this.price = price;
      this.lastUpdated = timestamp;
      this.createdAt = new Date();
      this.metadata = {};
    }
  },
}));

jest.mock('@/app/crypto/entities/asset.entity', () => ({
  Asset: class MockAssetClass {},
}));

jest.mock('@/app/crypto/entities/data-provider.entity', () => ({
  DataProvider: class MockDataProviderClass {},
}));

import { getRepositoryToken } from '@mikro-orm/nestjs';
import { PriceCalculationService } from './price-calculation.service';

// Import actual entity classes for proper token generation
import { TradingPair } from '@/app/crypto/entities/trading-pair.entity';
import { PriceHistory } from '@/app/crypto/entities/price-history.entity';

// Define mock entity types to avoid circular dependency issues
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

interface MockDataProvider {
  id: number;
  slug: string;
  name: string;
  description?: string;
  apiUrl?: string;
  website?: string;
  apiConfig?: Record<string, unknown>;
  isActive: boolean;
  rateLimitPerMinute: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MockTradingPair {
  id: number;
  baseAsset: MockAsset;
  quoteAsset: MockAsset;
  symbol: string;
  slug: string;
  isActive: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  priceHistories?: MockPriceHistory[];
}

interface MockPriceHistory {
  id: number;
  tradingPair: MockTradingPair;
  dataProvider: MockDataProvider;
  timestamp: Date;
  price: string;
  lastUpdated?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Define mock repository types
interface MockEntityManager {
  fork: jest.MockedFunction<() => MockEntityManager>;
  findOne: jest.MockedFunction<(...args: unknown[]) => Promise<unknown>>;
  find: jest.MockedFunction<(...args: unknown[]) => Promise<unknown[]>>;
  persist: jest.MockedFunction<(entity: unknown) => void>;
  flush: jest.MockedFunction<() => Promise<void>>;
  getRepository: jest.MockedFunction<(entity: unknown) => unknown>;
}

interface MockTradingPairRepository {
  find: jest.MockedFunction<(...args: unknown[]) => Promise<MockTradingPair[]>>;
  getEntityManager: jest.MockedFunction<() => MockEntityManager>;
}

interface MockPriceHistoryRepository {
  find: jest.MockedFunction<
    (...args: unknown[]) => Promise<MockPriceHistory[]>
  >;
  getEntityManager: jest.MockedFunction<() => MockEntityManager>;
}

describe('PriceCalculationService', () => {
  let service: PriceCalculationService;
  let tradingPairRepository: MockTradingPairRepository;
  let priceHistoryRepository: MockPriceHistoryRepository;

  // Mock entities using mock types to avoid circular dependencies
  let mockBtcAsset: MockAsset;
  let mockUsdAsset: MockAsset;
  let mockEthAsset: MockAsset;
  let mockBtcUsdPair: MockTradingPair;
  let mockEthBtcPair: MockTradingPair;
  let mockEthUsdPair: MockTradingPair;
  let mockDataProvider: MockDataProvider;

  beforeEach(async () => {
    // Create a proper mock EntityManager
    const mockEntityManager: MockEntityManager = {
      fork: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      find: jest.fn(),
      persist: jest.fn(),
      flush: jest.fn(),
      getRepository: jest.fn(),
    };

    // Create mock repository methods
    const mockTradingPairRepo: MockTradingPairRepository = {
      find: jest.fn(),
      getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
    };

    const mockPriceHistoryRepo: MockPriceHistoryRepository = {
      find: jest.fn(),
      getEntityManager: jest.fn().mockReturnValue(mockEntityManager),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceCalculationService,
        {
          provide: getRepositoryToken(TradingPair),
          useValue: mockTradingPairRepo,
        },
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: mockPriceHistoryRepo,
        },
      ],
    }).compile();

    service = module.get<PriceCalculationService>(PriceCalculationService);
    tradingPairRepository = module.get(getRepositoryToken(TradingPair));
    priceHistoryRepository = module.get(getRepositoryToken(PriceHistory));

    // Setup mock entities using plain objects
    setupMockEntities();
  });

  /**
   * Helper function to create consistent mock entities for all tests
   * Using plain objects to avoid circular dependency issues
   */
  function setupMockEntities(): void {
    // Create mock assets using plain objects
    mockBtcAsset = {
      id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      description: undefined,
      logoUrl: undefined,
      website: undefined,
      isActive: true,
      isFiat: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsdAsset = {
      id: 2,
      symbol: 'USD',
      name: 'US Dollar',
      description: undefined,
      logoUrl: undefined,
      website: undefined,
      isActive: true,
      isFiat: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockEthAsset = {
      id: 3,
      symbol: 'ETH',
      name: 'Ethereum',
      description: undefined,
      logoUrl: undefined,
      website: undefined,
      isActive: true,
      isFiat: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create mock data provider using plain object
    mockDataProvider = {
      id: 1,
      slug: 'binance',
      name: 'Binance',
      description: undefined,
      apiUrl: undefined,
      website: undefined,
      apiConfig: undefined,
      isActive: true,
      rateLimitPerMinute: 30,
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create mock trading pairs using plain objects
    mockBtcUsdPair = {
      id: 1,
      baseAsset: mockBtcAsset,
      quoteAsset: mockUsdAsset,
      symbol: 'BTC/USD',
      slug: 'btc-usd',
      isActive: true,
      isVisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistories: [],
    };

    mockEthBtcPair = {
      id: 2,
      baseAsset: mockEthAsset,
      quoteAsset: mockBtcAsset,
      symbol: 'ETH/BTC',
      slug: 'eth-btc',
      isActive: true,
      isVisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistories: [],
    };

    mockEthUsdPair = {
      id: 3,
      baseAsset: mockEthAsset,
      quoteAsset: mockUsdAsset,
      symbol: 'ETH/USD',
      slug: 'eth-usd',
      isActive: true,
      isVisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistories: [],
    };
  }

  /**
   * Helper function to create mock price history entries
   */
  function createMockPriceHistory(
    tradingPair: MockTradingPair,
    price: string,
    timestamp: Date = new Date()
  ): MockPriceHistory {
    // Use a consistent ID generation based on trading pair ID to avoid randomness
    const priceHistoryId =
      tradingPair.id * 100 + (Math.floor(timestamp.getTime() / 1000) % 100);

    const priceHistory: MockPriceHistory = {
      id: priceHistoryId,
      tradingPair: {
        ...tradingPair,
        id: tradingPair.id, // Ensure ID is properly set
        baseAsset: {
          ...tradingPair.baseAsset,
          id: tradingPair.baseAsset.id, // Ensure asset IDs are properly set
        },
        quoteAsset: {
          ...tradingPair.quoteAsset,
          id: tradingPair.quoteAsset.id,
        },
      },
      dataProvider: mockDataProvider,
      timestamp,
      price,
      lastUpdated: timestamp,
      metadata: {},
      createdAt: new Date(),
    };
    return priceHistory;
  }

  describe('calculateIndirectPrice', () => {
    /**
     * Test 1: Successful indirect price calculation through a valid path
     *
     * This test verifies that the service can successfully calculate an indirect price
     * when a direct price is not available but a valid calculation path exists.
     *
     * Scenario: Calculate ETH/USD price through ETH/BTC and BTC/USD pairs
     * - ETH/BTC = 0.05 (1 ETH = 0.05 BTC)
     * - BTC/USD = 50000 (1 BTC = 50000 USD)
     * - Expected ETH/USD = 0.05 * 50000 = 2500 USD
     */
    it('should successfully calculate indirect price through valid trading path', async () => {
      // Arrange: Setup mock data for a successful calculation path
      const inputEthBtcPrice = '0.05000000'; // 1 ETH = 0.05 BTC
      const inputBtcUsdPrice = '50000.00000000'; // 1 BTC = 50000 USD
      const expectedEthUsdPrice = 2500; // 0.05 * 50000 = 2500 USD

      // Mock repository responses - ensure assets are properly structured
      const mockTradingPairsWithAssets = [
        {
          ...mockEthBtcPair,
          baseAsset: mockEthAsset,
          quoteAsset: mockBtcAsset,
        },
        {
          ...mockBtcUsdPair,
          baseAsset: mockBtcAsset,
          quoteAsset: mockUsdAsset,
        },
      ];

      // Override the default mock implementation for this test
      (
        tradingPairRepository.find as jest.MockedFunction<
          (...args: unknown[]) => Promise<MockTradingPair[]>
        >
      ).mockImplementation((query: unknown) => {
        if (
          typeof query === 'object' &&
          query !== null &&
          'isActive' in query &&
          (query as Record<string, unknown>).isActive === true
        ) {
          return Promise.resolve(mockTradingPairsWithAssets);
        }
        return Promise.resolve([]);
      });

      // Create mock prices using the same trading pair references that the repository returns
      const mockPrices = [
        createMockPriceHistory(mockTradingPairsWithAssets[0], inputEthBtcPrice),
        createMockPriceHistory(mockTradingPairsWithAssets[1], inputBtcUsdPrice),
      ];

      // Override the default PriceHistoryRepository mock implementation for this test
      (
        priceHistoryRepository.find as jest.MockedFunction<
          (...args: unknown[]) => Promise<MockPriceHistory[]>
        >
      ).mockImplementation((query: unknown) => {
        if (typeof query !== 'object' || query === null) {
          return Promise.resolve(mockPrices);
        }

        const queryObj = query as Record<string, unknown>;

        // The service queries for prices with tradingPair: { $in: [pairIds] } and timestamp: { $gte: cutoffTime }
        if (
          queryObj.tradingPair &&
          typeof queryObj.tradingPair === 'object' &&
          queryObj.tradingPair !== null &&
          '$in' in queryObj.tradingPair
        ) {
          const pairIds = (queryObj.tradingPair as { $in: number[] }).$in;
          let filteredPrices = mockPrices.filter((price) =>
            pairIds.includes(price.tradingPair.id)
          );

          // Also handle timestamp filter if present
          if (
            queryObj.timestamp &&
            typeof queryObj.timestamp === 'object' &&
            queryObj.timestamp !== null &&
            '$gte' in queryObj.timestamp
          ) {
            const cutoffTime = (queryObj.timestamp as { $gte: Date }).$gte;
            filteredPrices = filteredPrices.filter(
              (price) => price.timestamp >= cutoffTime
            );
          }

          return Promise.resolve(filteredPrices);
        }
        return Promise.resolve(mockPrices);
      });

      // Act: Execute the indirect price calculation
      const result = await service.calculateIndirectPrice(
        mockEthUsdPair as MockTradingPair & TradingPair
      );

      // Assert: Verify the calculation result
      expect(result).toBeDefined();
      expect(result).toHaveProperty('price');
      if (result) {
        expect(parseFloat(result.price)).toBeCloseTo(expectedEthUsdPrice, 2);

        // Verify synthetic price metadata
        expect(result.metadata).toBeDefined();
        expect(result.metadata?.confidence).toBeDefined();
        expect(result.metadata?.calculatedAt).toBeDefined();

        // Verify data provider is synthetic
        expect(result.dataProvider.name).toBe('Calculated');
        expect(result.dataProvider.id).toBe(-1);
      }

      // Verify repository calls were made with correct parameters
      expect(tradingPairRepository.find).toHaveBeenCalledWith(
        { isActive: true },
        { populate: ['baseAsset', 'quoteAsset'] }
      );
      expect(priceHistoryRepository.find).toHaveBeenCalledWith({
        tradingPair: { $in: [2, 1] }, // mockEthBtcPair.id, mockBtcUsdPair.id
        timestamp: expect.any(Object),
      });
    });

    /**
     * Test 2: Handle case when no calculation paths are available
     *
     * This test ensures the service gracefully handles scenarios where
     * no indirect price calculation path exists between the requested assets.
     *
     * Scenario: Attempt to calculate ETH/USD price with no available trading pairs
     */
    it('should return null when no calculation paths are found', async () => {
      // Arrange: Setup scenario with no available trading pairs or prices
      tradingPairRepository.find.mockResolvedValue([]); // No active trading pairs
      priceHistoryRepository.find.mockImplementation(() => Promise.resolve([])); // No price history

      // Act: Attempt to calculate indirect price with no available data
      const result = await service.calculateIndirectPrice(
        mockEthUsdPair as MockTradingPair & TradingPair
      );

      // Assert: Verify service returns null for impossible calculations
      expect(result).toBeNull();

      // Verify repository calls were still made
      expect(tradingPairRepository.find).toHaveBeenCalledWith(
        { isActive: true },
        { populate: ['baseAsset', 'quoteAsset'] }
      );
      expect(priceHistoryRepository.find).toHaveBeenCalledWith({
        tradingPair: { $in: [] },
        timestamp: expect.any(Object),
      });
    });

    /**
     * Test 3: Confidence-based path selection with multiple available paths
     *
     * This test verifies that when multiple calculation paths are available,
     * the service selects the path with the highest confidence score based on
     * price freshness and path length (number of hops).
     *
     * Scenario: Multiple paths to calculate ETH/USD:
     * Path 1 (fresher): ETH/BTC (recent) -> BTC/USD (recent) = higher confidence
     * Path 2 (older): ETH/USD (old direct price) = lower confidence due to age
     */
    it('should select the best path based on confidence score when multiple paths exist', async () => {
      // Arrange: Setup multiple calculation paths with different confidence levels
      const recentTime = new Date(); // Fresh price data
      const oldTime = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours old (beyond TIME_DECAY_HOURS)

      // Create additional trading pair for alternative path
      const mockEthUsdDirectPair: MockTradingPair = {
        id: 4,
        baseAsset: mockEthAsset,
        quoteAsset: mockUsdAsset,
        symbol: 'ETH/USD',
        slug: 'eth-usd-direct',
        isActive: true,
        isVisible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        priceHistories: [],
      };

      const mockPrices = [
        // Fresh indirect path: ETH/BTC -> BTC/USD (should have higher confidence)
        createMockPriceHistory(mockEthBtcPair, '0.05000000', recentTime),
        createMockPriceHistory(mockBtcUsdPair, '50000.00000000', recentTime),
        // Old direct path: ETH/USD (should have lower confidence due to age)
        createMockPriceHistory(mockEthUsdDirectPair, '2400.00000000', oldTime),
      ];

      // Mock repository responses - ensure assets are properly structured
      const mockTradingPairsWithAssets = [
        {
          ...mockEthBtcPair,
          baseAsset: mockEthAsset,
          quoteAsset: mockBtcAsset,
        },
        {
          ...mockBtcUsdPair,
          baseAsset: mockBtcAsset,
          quoteAsset: mockUsdAsset,
        },
        {
          ...mockEthUsdDirectPair,
          baseAsset: mockEthAsset,
          quoteAsset: mockUsdAsset,
        },
      ];

      tradingPairRepository.find.mockResolvedValue(mockTradingPairsWithAssets);

      // Mock priceHistoryRepository.find to handle the query with tradingPair and timestamp filters
      priceHistoryRepository.find.mockImplementation((query: unknown) => {
        if (typeof query !== 'object' || query === null) {
          return Promise.resolve(mockPrices);
        }

        const queryObj = query as Record<string, unknown>;

        // The service queries for prices with tradingPair: { $in: [pairIds] } and timestamp: { $gte: cutoffTime }
        if (
          queryObj.tradingPair &&
          typeof queryObj.tradingPair === 'object' &&
          queryObj.tradingPair !== null &&
          '$in' in queryObj.tradingPair
        ) {
          const pairIds = (queryObj.tradingPair as { $in: number[] }).$in;
          let filteredPrices = mockPrices.filter((price) =>
            pairIds.includes(price.tradingPair.id)
          );

          // Also handle timestamp filter if present
          if (
            queryObj.timestamp &&
            typeof queryObj.timestamp === 'object' &&
            queryObj.timestamp !== null &&
            '$gte' in queryObj.timestamp
          ) {
            const cutoffTime = (queryObj.timestamp as { $gte: Date }).$gte;
            filteredPrices = filteredPrices.filter(
              (price) => price.timestamp >= cutoffTime
            );
          }

          return Promise.resolve(filteredPrices);
        }
        return Promise.resolve(mockPrices);
      });

      // Act: Execute indirect price calculation with multiple available paths
      const result = await service.calculateIndirectPrice(
        mockEthUsdPair as MockTradingPair & TradingPair
      );

      // Assert: Verify service selected the path with higher confidence
      expect(result).toBeDefined();
      expect(result).toHaveProperty('price');

      if (result) {
        // The fresh indirect path (ETH/BTC -> BTC/USD = 2500) should be selected
        // over the old direct path (2400) due to higher confidence from recent data
        const calculatedPrice = parseFloat(result.price);
        expect(calculatedPrice).toBeCloseTo(2500, 2); // 0.05 * 50000 = 2500

        // Verify confidence metadata exists and is reasonable
        expect(result.metadata?.confidence).toBeDefined();
        expect(result.metadata?.confidence).toBeGreaterThan(0);
        expect(result.metadata?.confidence).toBeLessThanOrEqual(1);

        // Verify synthetic data provider
        expect(result.dataProvider.name).toBe('Calculated');
      }

      // Verify all trading pairs were considered
      expect(tradingPairRepository.find).toHaveBeenCalledWith(
        { isActive: true },
        { populate: ['baseAsset', 'quoteAsset'] }
      );
    });
  });

  /**
   * Test service initialization and dependency injection
   */
  describe('Service Initialization', () => {
    it('should be defined and properly initialized', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PriceCalculationService);
    });

    it('should have required dependencies injected', () => {
      expect(tradingPairRepository).toBeDefined();
      expect(priceHistoryRepository).toBeDefined();
    });
  });
});

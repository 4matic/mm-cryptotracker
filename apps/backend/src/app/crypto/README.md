# Crypto Module

The Crypto module is the core component of the cryptocurrency tracking system, providing comprehensive management of cryptocurrency assets, trading pairs, data providers, and price history. It implements both REST API and GraphQL interfaces for flexible data access.

## Architecture Overview

```
crypto/
├── controllers/          # REST API endpoints
├── services/            # Business logic and data operations
├── dto/                 # Data Transfer Objects for API validation
├── graphql/            # GraphQL resolvers and module
└── crypto.module.ts    # Main module configuration
```

## Core Entities

The module manages four primary entities:

### 1. **Asset** (`asset.entity.ts`)
Represents individual cryptocurrencies (BTC, ETH, etc.)
- Symbol, name, description
- Logo URL and website information
- Active status management

### 2. **TradingPair** (`trading-pair.entity.ts`)
Represents trading relationships between two assets (e.g., BTC/USD)
- Base and quote asset relationships
- Visibility and active status
- Symbol generation and management

### 3. **DataProvider** (`data-provider.entity.ts`)
Represents sources of price data (exchanges, APIs)
- Name, description, and priority
- Active status and slug identification
- Rate limiting and reliability tracking

### 4. **PriceHistory** (`price-history.entity.ts`)
Stores historical price data for trading pairs
- Timestamp-based price records
- Data provider attribution
- Metadata for calculated/synthetic prices

## API Interfaces

### REST API Controllers

#### AssetController (`/assets`)
- `GET /assets` - Paginated list of active assets
- `GET /assets/:id` - Get asset by ID
- `GET /assets/symbol/:symbol` - Get asset by symbol

#### TradingPairController (`/trading-pairs`)
- `GET /trading-pairs` - Paginated list with visibility filtering
- `GET /trading-pairs/:id` - Get trading pair by ID
- `GET /trading-pairs/symbol/:symbol` - Get trading pair by symbol
- `GET /trading-pairs/base/:symbol` - Get pairs by base asset

#### DataProviderController (`/data-providers`)
- `GET /data-providers` - Paginated list of data providers
- `GET /data-providers/:id` - Get data provider by ID
- `GET /data-providers/slug/:slug` - Get data provider by slug

#### PriceHistoryController (`/price-history`)
- `GET /price-history/:tradingPairId` - Get price history for trading pair
- `GET /price-history/:tradingPairId/latest` - Get latest price
- `GET /price-history/:tradingPairId/range` - Get prices within date range

### GraphQL API

The module provides GraphQL resolvers for all entities:

#### AssetResolver
- `assets` - Query all active assets
- `asset(id)` - Query asset by ID
- `assetBySymbol(symbol)` - Query asset by symbol
- `assetsWithPagination(page, limit)` - Paginated asset query

#### TradingPairResolver
- `tradingPairs` - Query all trading pairs
- `tradingPair(id)` - Query trading pair by ID
- `tradingPairBySymbol(symbol)` - Query by symbol

#### DataProviderResolver
- `dataProviders` - Query all data providers
- `dataProvider(id)` - Query by ID

#### PriceHistoryResolver
- `priceHistory(tradingPairId)` - Query price history
- `latestPrice(tradingPairId)` - Query latest price

## Advanced Features

### Price Calculation Service

The `PriceCalculationService` provides sophisticated indirect price calculation when direct price data is unavailable:

**Key Features:**
- **Multi-hop Price Paths**: Calculates prices through intermediate trading pairs (max 3 hops)
- **Confidence Scoring**: Weights paths based on data freshness and hop count
- **Graph-based Path Finding**: Uses BFS algorithm to find optimal price calculation routes
- **Synthetic Price Generation**: Creates calculated `PriceHistory` entries with metadata

**Configuration:**
```typescript
private readonly MAX_HOPS = 3;              // Maximum trading pair hops
private readonly CONFIDENCE_DECAY = 0.8;    // Confidence reduction per hop
private readonly TIME_DECAY_HOURS = 24;     // Time window for valid prices
```

**Example Usage:**
```typescript
// Calculate BTC/EUR price through BTC/USD and USD/EUR
const indirectPrice = await priceCalculationService
  .calculateIndirectPrice(btcEurTradingPair);
```

## Data Transfer Objects (DTOs)

### AssetDTO
- `PaginatedAssetsResponseDto` - Structured response for paginated asset queries

### TradingPairDTO
- `PaginatedTradingPairsResponseDto` - Structured response for paginated trading pair queries

### DataProviderDTO
- `PaginatedDataProvidersResponseDto` - Structured response for paginated data provider queries
- Comprehensive validation and API documentation

### PriceHistoryDTO
- `PaginatedPriceHistoryResponseDto` - Structured response for price history queries
- Date range and filtering options

## Services Architecture

### Service Layer Responsibilities

#### AssetService
- Asset lifecycle management (create, update, deactivate)
- Symbol-based and ID-based lookups
- Pagination and filtering
- Comprehensive logging and error handling

#### TradingPairService
- Trading pair management and validation
- Relationship handling between base and quote assets
- Visibility and status management
- Base asset filtering

#### DataProviderService
- Data provider lifecycle management
- Priority-based ordering
- Slug and name-based lookups
- Active status management

#### PriceHistoryService
- Historical price data management
- Time-series data operations
- Latest price retrieval
- Date range filtering

#### PriceCalculationService
- Advanced indirect price calculations
- Multi-path price discovery
- Confidence scoring algorithms
- Synthetic price generation

## Database Integration

The module uses **MikroORM** with the following configuration:

```typescript
@Module({
  imports: [
    MikroOrmModule.forFeature([Asset, TradingPair, DataProvider, PriceHistory]),
  ],
  // ...
})
```

**Key Features:**
- Repository pattern implementation
- Request context management with `@EnsureRequestContext()`
- Entity relationships with proper loading strategies
- Transaction management and data consistency

## API Documentation

All REST endpoints are documented with **Swagger/OpenAPI**:
- Comprehensive parameter descriptions
- Request/response examples
- Error status codes
- Type definitions

## Testing

### Unit Tests
- `asset.controller.spec.ts` - Asset controller testing
- `price-calculation.service.spec.ts` - Price calculation logic testing

### Test Coverage
- Controller endpoint validation
- Service business logic verification
- Price calculation algorithm testing
- Error handling scenarios

## Logging and Monitoring

The module implements comprehensive logging:
- **Structured Logging**: Using NestJS Logger with contextual information
- **Performance Tracking**: Execution time monitoring for price calculations
- **Error Tracking**: Detailed error logging with stack traces
- **Debug Information**: Configurable debug logging for development

## GraphQL Integration

### GraphQL Module Structure
```typescript
@Module({
  imports: [CryptoModule],
  providers: [
    AssetResolver,
    TradingPairResolver, 
    DataProviderResolver,
    PriceHistoryResolver,
  ],
})
export class GraphQLApiModule {}
```

### Schema Generation
- Automatic schema generation from TypeScript types
- Shared GraphQL models via `@mm-cryptotracker/shared-graphql`
- Type-safe query and mutation operations

## Module Dependencies

### Internal Dependencies
- `@/entities` - Entity definitions
- `@/repositories` - Custom repository implementations
- `@mm-cryptotracker/shared-graphql` - Shared GraphQL types

### External Dependencies
- `@nestjs/common` - Core NestJS functionality
- `@mikro-orm/nestjs` - ORM integration
- `@nestjs/swagger` - API documentation
- `@nestjs/graphql` - GraphQL support

## Configuration

The module exports all services for use by other modules:

```typescript
exports: [
  AssetService,
  TradingPairService,
  DataProviderService,
  PriceHistoryService,
  PriceCalculationService,
],
```

## Usage Examples

### REST API
```bash
# Get all assets with pagination
GET /assets?page=1&limit=20

# Get specific trading pair
GET /trading-pairs/symbol/BTC%2FUSD

# Get price history for a trading pair
GET /price-history/123/range?startDate=2024-01-01&endDate=2024-01-31
```

### GraphQL
```graphql
query GetAssets($page: Int, $limit: Int) {
  assetsWithPagination(page: $page, limit: $limit) {
    id
    symbol
    name
    description
    isActive
  }
}

query GetTradingPair($symbol: String!) {
  tradingPairBySymbol(symbol: $symbol) {
    id
    symbol
    baseAsset {
      symbol
      name
    }
    quoteAsset {
      symbol
      name
    }
  }
}
```

## Performance Considerations

- **Pagination**: All list endpoints support pagination to manage large datasets
- **Lazy Loading**: Entity relationships are loaded on-demand
- **Caching**: Price calculation results include confidence metadata for caching decisions
- **Indexing**: Database indexes on frequently queried fields (symbol, timestamps)

## Error Handling

- **Validation**: Input validation using class-validator decorators
- **Not Found**: Proper 404 responses for missing entities
- **Business Logic**: Meaningful error messages for business rule violations
- **Logging**: All errors are logged with context for debugging

## Future Enhancements

- Price alerts and notifications
- Historical data analytics
- Real-time price updates via WebSocket
- Advanced price prediction algorithms
- Market analysis tools

# GraphQL API

This directory contains GraphQL resolvers and module configuration for the crypto tracker application.

## Structure

- `resolvers/` - GraphQL resolvers that handle queries and field resolution
  - `asset.resolver.ts` - Asset entity queries with pagination support
  - `trading-pair.resolver.ts` - Trading pair queries with price calculation resolve fields
  - `data-provider.resolver.ts` - Data provider entity queries
  - `price-history.resolver.ts` - Price history queries with relationship resolvers
  - `index.ts` - Barrel exports for all resolvers
- `graphql.module.ts` - NestJS module that registers resolvers and imports dependencies
- `index.ts` - Main exports from the GraphQL module

## Dependencies

- GraphQL models are imported from `@mm-cryptotracker/shared-graphql` (shared library)
- Business logic is handled through services from the `CryptoModule`
- Uses NestJS GraphQL with code-first approach

## Available Queries

### Assets
```graphql
# Get all active assets
query {
  assets {
    id
    symbol
    name
    description
    isActive
    isFiat
    createdAt
    updatedAt
  }
}

# Get a specific asset by ID
query {
  asset(id: 1) {
    id
    symbol
    name
    description
  }
}

# Get asset by symbol
query {
  assetBySymbol(symbol: "BTC") {
    id
    symbol
    name
    description
  }
}

# Get assets with pagination
query {
  assetsWithPagination(page: 1, limit: 10) {
    id
    symbol
    name
    description
    isActive
    isFiat
  }
}
```

### Trading Pairs
```graphql
# Get all active trading pairs
query {
  tradingPairs {
    id
    symbol
    isActive
    isVisible
    baseAsset {
      symbol
      name
    }
    quoteAsset {
      symbol
      name
    }
    # Resolve fields
    latestPrice {
      price
      timestamp
    }
    calculatedPrice {
      price
      timestamp
    }
  }
}

# Get a specific trading pair by ID
query {
  tradingPair(id: 1) {
    id
    symbol
    baseAsset {
      symbol
    }
    quoteAsset {
      symbol
    }
    latestPrice {
      price
      timestamp
    }
  }
}

# Get trading pair by symbol
query {
  tradingPairBySymbol(symbol: "BTC/USD") {
    id
    symbol
    baseAsset {
      symbol
    }
    quoteAsset {
      symbol
    }
  }
}

# Get trading pair by slug
query {
  tradingPairBySlug(slug: "btc-usd") {
    id
    symbol
    slug
    baseAsset {
      symbol
    }
    quoteAsset {
      symbol
    }
  }
}

# Get trading pairs with pagination and filtering
query {
  tradingPairsWithPagination(page: 1, limit: 20, isVisible: true) {
    tradingPairs {
      id
      symbol
      isVisible
      baseAsset {
        symbol
      }
      quoteAsset {
        symbol
      }
    }
    total
    page
    limit
  }
}
```

### Data Providers
```graphql
# Get all active data providers
query {
  dataProviders {
    id
    name
    slug
    description
    isActive
    priority
  }
}

# Get a specific data provider by ID
query {
  dataProvider(id: 1) {
    id
    name
    slug
    description
    isActive
    priority
  }
}

# Get data provider by name
query {
  dataProviderByName(name: "CoinGecko") {
    id
    name
    slug
    description
    isActive
    priority
  }
}
```

### Price History
```graphql
# Get price histories with optional filtering
query {
  priceHistories(tradingPairId: 1, limit: 10) {
    id
    price
    timestamp
    lastUpdated
    metadata
    createdAt
    tradingPair {
      symbol
      baseAsset {
        symbol
      }
      quoteAsset {
        symbol
      }
    }
    dataProvider {
      name
      slug
    }
  }
}

# Get price histories with date range filtering
query {
  priceHistories(
    tradingPairId: 1,
    dataProviderId: 1,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    limit: 100
  ) {
    id
    price
    timestamp
    tradingPair {
      symbol
    }
    dataProvider {
      name
    }
  }
}

# Get latest price for a trading pair
query {
  latestPrice(tradingPairId: 1) {
    price
    timestamp
    lastUpdated
    tradingPair {
      symbol
    }
    dataProvider {
      name
    }
  }
}

# Get chart data for a specific time period
query {
  chartData(
    tradingPairId: 1,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-01-31T23:59:59Z"
  ) {
    price
    timestamp
    tradingPair {
      symbol
    }
  }
}
```

## Resolve Fields & Special Behaviors

### Trading Pair Resolve Fields

The `TradingPair` entity includes two special resolve fields that provide automatic price calculations:

#### `latestPrice`
- Returns the most recent price data for the trading pair
- Uses `PriceHistoryService.getLatestPrice()` 
- Returns `null` if no price data exists

#### `calculatedPrice`
- Provides smart price calculation when direct price data is unavailable
- Only executes if `latestPrice` is `null` (avoids unnecessary calculations)
- Uses `PriceCalculationService.calculateIndirectPrice()` for cross-pair calculations
- Enables price discovery through trading pair relationships (e.g., calculate BTC/EUR from BTC/USD + USD/EUR)

### Relationship Resolution

#### Price History Resolvers
The `PriceHistory` entity includes field resolvers for:
- `tradingPair` - Resolves to the associated trading pair
- `dataProvider` - Resolves to the data source provider

These fields are typically pre-populated by the service layer to avoid N+1 query problems.

## Technical Implementation Notes

- **Code-First Approach**: GraphQL schema is generated from TypeScript classes and decorators
- **Service Integration**: All resolvers delegate business logic to dedicated service classes
- **Shared Models**: GraphQL types are imported from `@mm-cryptotracker/shared-graphql` library
- **Error Handling**: Leverages NestJS's built-in exception filters and GraphQL error formatting
- **Performance**: Relationship fields are optimized to prevent N+1 queries through service-level data loading

## Module Dependencies

```typescript
@Module({
  imports: [CryptoModule],           // Business logic services
  providers: [                      // GraphQL resolvers
    AssetResolver,
    TradingPairResolver, 
    DataProviderResolver,
    PriceHistoryResolver,
  ],
})
```

The module imports `CryptoModule` which provides:
- `AssetService` - Asset entity operations
- `TradingPairService` - Trading pair entity operations  
- `DataProviderService` - Data provider entity operations
- `PriceHistoryService` - Price history queries and data retrieval
- `PriceCalculationService` - Smart price calculation algorithms

## Notes

- All queries are read-only (no mutations implemented as per requirements)
- Relationships are resolved through dedicated field resolvers to maintain separation of concerns
- The GraphQL schema is generated automatically using the code-first approach
- Resolve fields provide computed values without requiring separate API calls

# GraphQL API

This directory contains GraphQL models and resolvers for the crypto tracker application.

## Structure

- `models/` - GraphQL ObjectTypes that define the schema
- `resolvers/` - GraphQL resolvers that handle queries
- `graphql.module.ts` - NestJS module that wires everything together

## Available Queries

### Assets
```graphql
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

query {
  asset(id: 1) {
    id
    symbol
    name
  }
}

query {
  assetBySymbol(symbol: "BTC") {
    id
    symbol
    name
  }
}
```

### Trading Pairs
```graphql
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
  }
}

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
  }
}
```

### Data Providers
```graphql
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
```

### Price History
```graphql
query {
  priceHistories(tradingPairId: 1, limit: 10) {
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

query {
  latestPrice(tradingPairId: 1) {
    price
    timestamp
    tradingPair {
      symbol
    }
  }
}
```

## Notes

- All queries are read-only (no mutations implemented as per requirements)
- Relationships are resolved through separate resolvers to avoid circular dependencies
- The GraphQL schema is generated automatically using the code-first approach

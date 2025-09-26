# @mm-cryptotracker/shared-graphql

A shared TypeScript library containing GraphQL schema models for the crypto tracker application.

## Overview

This library provides reusable GraphQL ObjectType models that define the GraphQL schema structure shared between the backend API and frontend applications. It serves as the single source of truth for the GraphQL type definitions used across the crypto tracker monorepo.

## Features

- **Type-safe GraphQL Models**: Fully typed GraphQL ObjectType definitions using NestJS GraphQL decorators
- **Shared Schema Definition**: Consistent schema models used across backend resolvers and frontend queries
- **Entity Mapping**: Direct mapping to database entities with proper field decorators
- **Relationship Handling**: Complex object relationships between assets, trading pairs, and price data
- **Pagination Support**: Built-in pagination models for large data sets

## Models

### AssetModel
Represents cryptocurrency or fiat currency assets.

### DataProviderModel
Represents external data sources for price information.

### TradingPairModel
Represents trading pairs between two assets.

### PriceHistoryModel
Represents historical price data points.

### PaginatedTradingPairsModel
Provides paginated results for trading pair queries.

## Usage

### Backend Integration
The models are used in GraphQL resolvers to define return types:

```typescript
import { DataProviderModel } from '@mm-cryptotracker/shared-graphql';

@Resolver(() => DataProviderModel)
export class DataProviderResolver {
  @Query(() => [DataProviderModel])
  async dataProviders(): Promise<DataProvider[]> {
    return this.dataProviderService.findAllActive();
  }
}
```

### Frontend Integration
The types are referenced in generated GraphQL query types and used for type-safe data handling in React components.

## Dependencies

- **@nestjs/graphql**: NestJS GraphQL integration and decorators
- **graphql-type-json**: GraphQL JSON scalar type support
- **typescript**: Type definitions and compilation

## Development

### Building
```bash
nx build graphql
```

### Type Checking
```bash
nx typecheck graphql
```

### Linting
```bash
nx lint graphql
```

## Architecture Notes

- **Shared Library Pattern**: Centralizes GraphQL schema definitions to maintain consistency
- **Type Safety**: Ensures type safety between backend entities and frontend queries
- **Separation of Concerns**: Keeps GraphQL models separate from database entities
- **Extensibility**: Easy to extend with new models or modify existing ones

## Related Documentation

- [Backend GraphQL API Documentation](../../apps/backend/src/app/crypto/README.md)
- [Database Entities](../../apps/backend/src/entities/)
- [Frontend GraphQL Integration](../../apps/frontend/src/graphql/)

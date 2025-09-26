# CryptoTracker Backend

A comprehensive NestJS backend application for tracking cryptocurrency prices and historical data, built with MikroORM, GraphQL, and REST APIs.

## Overview

This backend serves as the core API layer for the CryptoTracker application, providing robust cryptocurrency price tracking, asset management, and historical data analysis. It supports both REST and GraphQL interfaces, with automated price fetching from multiple external data providers.

## Project Structure

```
apps/backend/
├── src/
│   ├── app/
│   │   ├── crypto/                   # Core crypto module
│   │   │   ├── controllers/          # REST API endpoints
│   │   │   ├── services/            # Business logic
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   └── graphql/             # GraphQL resolvers
│   │   └── price-fetching/          # Price data fetching module
│   │       ├── controllers/         # Price fetching endpoints
│   │       ├── services/           # Fetching logic
│   │       └── providers/          # External data providers
│   ├── entities/                    # Database entities
│   ├── repositories/               # Custom repositories
│   ├── config/                     # Application configuration
│   ├── migrations/                 # Database migrations
│   └── seeders/                    # Database seeders
├── Dockerfile                      # Container configuration
└── package.json                   # Project dependencies
```

## Features

### Core Functionality
- **Asset Management**: Comprehensive cryptocurrency and fiat asset tracking
- **Trading Pair Management**: Dynamic trading pair relationships and price monitoring  
- **Historical Price Data**: Complete OHLCV data storage and retrieval
- **Multiple Data Providers**: Extensible provider system with fallback support
- **Advanced Price Calculations**: Multi-hop indirect price calculation with confidence scoring

### API Interfaces
- **RESTful API**: Full REST API with comprehensive endpoints
- **GraphQL API**: Flexible GraphQL queries with relationship resolution
- **Real-time Updates**: Automated price fetching with configurable intervals
- **Comprehensive Documentation**: OpenAPI/Swagger documentation for all endpoints

### Technical Features
- **Database Integration**: MikroORM with PostgreSQL
- **Type Safety**: Full TypeScript implementation with strict typing
- **Error Handling**: Comprehensive error management and recovery
- **Testing**: Unit and integration tests with Jest
- **Docker Support**: Containerized deployment with Docker

## Core Modules

### 1. Crypto Module
The primary module containing core cryptocurrency functionality.

**📖 [Detailed Crypto Module Documentation](src/app/crypto/README.md)**

- Asset management and querying
- Trading pair relationships
- Data provider configuration
- Price history storage
- Advanced price calculation algorithms

### 2. Price Fetching Module  
Handles automated price data collection from external APIs.

**📖 [Detailed Price Fetching Documentation](src/app/price-fetching/README.md)**

- CoinMarketCap integration
- Provider priority system
- Automated scheduling
- Error handling and recovery
- Rate limit management

### 3. GraphQL API
Flexible GraphQL interface for efficient data querying.

**📖 [GraphQL API Documentation](src/app/crypto/graphql/README.md)**

- Type-safe schema definitions
- Relationship resolvers
- Optimized data fetching
- Comprehensive query examples

## Database Schema

### Primary Entities

1. **Asset** (`entities/asset.entity.ts`)
   - Cryptocurrency and fiat currency definitions
   - Symbol, name, description, and metadata
   - Active status and categorization
   - Market information and external references

2. **TradingPair** (`entities/trading-pair.entity.ts`)  
   - Relationships between base and quote assets
   - Visibility and active status management
   - Current price and market statistics
   - Symbol generation and validation

3. **DataProvider** (`entities/data-provider.entity.ts`)
   - External price data source configuration
   - API credentials and rate limiting
   - Priority ordering and fallback logic
   - Status monitoring and health checks

4. **PriceHistory** (`entities/price-history.entity.ts`)
   - Historical price data with timestamps
   - Provider attribution and metadata
   - Calculated vs. direct price tracking
   - OHLCV data structure

## Quick Start

### Prerequisites

- **Node.js 18+**: Runtime environment
- **PostgreSQL 13+**: Primary database
- **npm or bun**: Package manager (bun recommended for performance)

### Environment Configuration

Copy `env.example` to `.env` and configure required variables:

```bash
# Database Configuration (required)
# See: src/config/database.config.ts
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=cryptotracker

# Application Configuration (required) 
# See: src/config/app.config.ts
NODE_ENV=development
PORT=4000

# Data Provider Configuration (optional)
# See: src/config/data-provider.config.ts
DATA_PROVIDER_FETCH_INTERVAL_MS=300000  # 5 minutes (default)

# Seeder-Specific Configuration (required for seeding only)
# See: src/config/seeder.config.ts
ASSETS_PUBLIC_URL=http://localhost:4000              # For asset logos in seeders
DATA_PROVIDER_COINMARKETCAP_API_KEY=your_api_key_here  # For provider seeder
```

### Configuration Structure

The application uses a structured configuration system with validation:

📖 **Configuration Files**:
- **[`app.config.ts`](src/config/app.config.ts)** - Core application settings (port, environment)
- **[`database.config.ts`](src/config/database.config.ts)** - Database connection parameters  
- **[`data-provider.config.ts`](src/config/data-provider.config.ts)** - Price fetching intervals
- **[`seeder.config.ts`](src/config/seeder.config.ts)** - Seeder-specific configuration (assets URL, API keys)

**Key Points**:
- All configs use **Zod validation** for type safety and runtime validation
- **Seeder config** is only required when running `npm run seeder:run`
- **Environment-specific defaults**: Debug mode automatically disabled in production
- **Required vs Optional**: Missing required variables will cause startup errors with clear messages

### Installation & Setup

```bash
# Install all dependencies (from workspace root)
npm install

# Navigate to backend directory
cd apps/backend

# Create database (ensure PostgreSQL is running)
createdb cryptotracker

# Generate initial migration (if needed)
npm run migration:create -- --initial

# Run database migrations
npm run migration:up

# Seed initial data
npm run seeder:run
```

### Running the Application

```bash
# Development mode with hot reload (from workspace root)
nx serve backend

# Production build
nx build backend

# Run production build
node dist/apps/backend/main.js
```

### Docker Deployment

```bash
# Build Docker image (from workspace root)
nx docker:build backend

# Run with docker-compose (includes PostgreSQL)
docker-compose up -d
```

## API Reference

The backend provides both REST and GraphQL APIs for comprehensive data access.

### REST API Endpoints

#### Assets (`/api/assets`)
- `GET /assets` - List all assets with pagination and filtering
- `GET /assets/:id` - Get specific asset by ID
- `GET /assets/symbol/:symbol` - Get asset by symbol (e.g., BTC, ETH)
- `POST /assets` - Create new asset (admin only)

#### Trading Pairs (`/api/trading-pairs`)  
- `GET /trading-pairs` - List all trading pairs with pagination
- `GET /trading-pairs/:id` - Get trading pair by ID
- `GET /trading-pairs/symbol/:symbol` - Get trading pair by symbol (e.g., BTC/USD)
- `GET /trading-pairs/base/:symbol` - Get all pairs for base asset
- `POST /trading-pairs` - Create new trading pair
- `POST /trading-pairs/:id/price` - Update current price data

#### Data Providers (`/api/data-providers`)
- `GET /data-providers` - List all configured data providers
- `GET /data-providers/:id` - Get data provider by ID
- `GET /data-providers/slug/:slug` - Get data provider by slug

#### Price History (`/api/price-history`)
- `GET /price-history/:tradingPairId` - Get price history for trading pair
- `GET /price-history/:tradingPairId/latest` - Get latest price 
- `GET /price-history/:tradingPairId/range` - Get prices within date range
- `POST /price-history` - Create new price history entry

#### Price Fetching (`/api/price-fetching`)
- `POST /price-fetching/fetch-prices` - Fetch specific symbols
- `POST /price-fetching/fetch-all-active` - Fetch all active trading pairs  
- `GET /price-fetching/providers/status` - Get provider status
- `POST /price-fetching/providers/initialize` - Initialize providers

### GraphQL API

Access the GraphQL playground at `/graphql` when running in development mode.

**📖 [Complete GraphQL API Documentation](src/app/crypto/graphql/README.md)**

#### Sample Queries

```graphql
# Get all assets
query GetAssets {
  assets {
    id
    symbol
    name
    isActive
  }
}

# Get trading pair with relationships
query GetTradingPair($symbol: String!) {
  tradingPairBySymbol(symbol: $symbol) {
    id
    symbol
    baseAsset { symbol name }
    quoteAsset { symbol name }
  }
}

# Get price history
query GetPriceHistory($tradingPairId: Int!) {
  priceHistories(tradingPairId: $tradingPairId, limit: 10) {
    price
    timestamp
    dataProvider { name }
  }
}
```

### API Documentation

- **Swagger UI**: Available at `/api/docs` in development mode
- **OpenAPI Spec**: Available at `/api/docs-json`
- **GraphQL Playground**: Available at `/graphql` in development mode

## Database Management

### Migration Commands

```bash
# Create new migration
npm run migration:create

# Run pending migrations  
npm run migration:up

# Rollback last migration
npm run migration:down

# List migration status
npm run migration:list

# Fresh migration (drop and recreate)
npm run migration:fresh
```

### Schema Commands (Development Only)

```bash
# Create schema from entities
npm run schema:create

# Update schema to match entities
npm run schema:update

# Drop entire schema
npm run schema:drop
```

### Seeder Commands

```bash
# Run all seeders (requires seeder-specific environment variables)
npm run seeder:run

# Create new seeder
npm run seeder:create --name=YourSeederName

# Run specific seeder
npm run seeder:run -- --class=AssetSeeder
```

**Note**: Seeders require additional environment variables defined in [`seeder.config.ts`](src/config/seeder.config.ts):
- `ASSETS_PUBLIC_URL` - For asset logo URLs
- `DATA_PROVIDER_COINMARKETCAP_API_KEY` - For CoinMarketCap provider configuration

## Architecture & Design

### Technical Architecture

The application follows **Clean Architecture** principles with NestJS:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │ Controllers │    │ GraphQL         │ │
│  │ (REST)      │    │ Resolvers       │ │
│  └─────────────┘    └─────────────────┘ │
├─────────────────────────────────────────┤
│              Business Layer             │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │ Services    │    │ Price           │ │
│  │ (Core Logic)│    │ Calculation     │ │
│  └─────────────┘    └─────────────────┘ │
├─────────────────────────────────────────┤
│               Data Layer                │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │ Entities    │    │ Repositories    │ │
│  │ (MikroORM)  │    │ (Custom)        │ │
│  └─────────────┘    └─────────────────┘ │
├─────────────────────────────────────────┤
│            External Layer               │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │ Data        │    │ Database        │ │
│  │ Providers   │    │ (PostgreSQL)    │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
```

### Design Principles

- **Modular Architecture**: Feature-based module organization
- **Dependency Injection**: Constructor-based DI with NestJS
- **Repository Pattern**: Custom repositories for complex queries  
- **DTO Pattern**: Data validation and transformation
- **Service Layer**: Business logic separation
- **Entity-First Design**: Database schema driven by entities
- **Type Safety**: Full TypeScript implementation

### Key Components

- **Request Context**: MikroORM request context for transaction management
- **Global Guards**: Authentication and authorization (when implemented)
- **Exception Filters**: Centralized error handling
- **Interceptors**: Request/response transformation
- **Validators**: Input validation with class-validator
- **Configuration**: Environment-based configuration management

## Development Guide

### Project Setup for Development

```bash
# Clone and setup workspace (from root)
npm install

# Setup backend environment
cd apps/backend
cp env.example .env
# Configure your environment variables

# Setup database
createdb cryptotracker
npm run migration:up
npm run seeder:run

# Start development server
cd ../../
nx serve backend
```

### Development Workflow

#### Adding New Features

1. **Plan the feature**: Define entities, services, and endpoints
2. **Create/Update entities**: Add to `src/entities/`
3. **Generate migration**: `npm run migration:create`
4. **Add service logic**: Business logic in `src/app/crypto/services/`
5. **Create DTOs**: Request/response objects in `dto/` folders
6. **Add controllers**: REST endpoints in `controllers/` folders
7. **Add GraphQL resolvers** (if needed): GraphQL queries in `graphql/resolvers/`
8. **Write tests**: Unit tests for services and controllers
9. **Update documentation**: Module-specific README files
10. **Run migrations**: Apply database changes

#### Testing Strategy

```bash
# Run all tests
nx test backend

# Run specific test suites
nx test backend --testNamePattern="AssetController"

# Run with coverage
nx test backend --coverage

# Run e2e tests
nx e2e backend-e2e

# Watch mode during development
nx test backend --watch
```

#### Database Development

```bash
# Generate entity changes to new migration
npm run migration:create

# Preview migration SQL
npm run migration:up --dry-run  

# Apply migrations
npm run migration:up

# Reset database with fresh migrations
npm run migration:fresh
npm run seeder:run
```

### Adding New Data Providers

Follow the extensible provider pattern:

**📖 [Detailed Provider Integration Guide](src/app/price-fetching/README.md#adding-new-data-providers)**

1. **Implement `AbstractDataProvider`** - Create provider class
2. **Add to provider factory** - Register in service factory method
3. **Configure in database via seeder** - Add provider entry with seeder
4. **Add seeder configuration** - Update `seeder.config.ts` for API keys (seeding only)
5. **Update environment** - Add required variables to `env.example`

### Code Quality Standards

- **TypeScript Strict Mode**: Enforced strict type checking
- **ESLint Configuration**: Consistent code formatting
- **Prettier Integration**: Automatic code formatting  
- **Unit Test Coverage**: Target >80% coverage for services
- **Integration Tests**: Critical user flows
- **Documentation**: JSDoc comments for public APIs

## Related Documentation

This README provides an overview of the backend. For detailed information about specific components:

### Backend Modules
- **📖 [Crypto Module](src/app/crypto/README.md)** - Core cryptocurrency functionality, services, and advanced price calculations
- **📖 [Price Fetching Module](src/app/price-fetching/README.md)** - External API integration, provider management, and automated price updates  
- **📖 [GraphQL API](src/app/crypto/graphql/README.md)** - GraphQL schema, resolvers, and query examples

### Shared Libraries  
- **📖 [Shared GraphQL Types](../../libs/shared/graphql/README.md)** - Common GraphQL schema definitions used across the monorepo

### Frontend Integration
- **📖 [Frontend Application](../frontend/README.md)** - Next.js frontend consuming these APIs
- **📖 [Frontend E2E Tests](../frontend-e2e/README.md)** - Integration tests for the full stack

### Project Documentation
- **📖 [Project Overview](../../README.md)** - Workspace setup, architecture, and contribution guidelines
- **📖 [Docker Configuration](../../docker-compose.yml)** - Container orchestration and deployment

### API References
- **🌐 Swagger Documentation**: `/api` (when running locally)
- **🌐 GraphQL Playground**: `/graphql` (when running locally)  
- **📄 OpenAPI Specification**: `/api-json` (when running locally)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check PostgreSQL is running
   brew services start postgresql
   # or
   sudo systemctl start postgresql
   ```

2. **Migration Errors**
   ```bash
   # Reset migrations (development only)
   npm run migration:fresh
   npm run seeder:run
   ```

3. **Port Already in Use**
   ```bash
   # Check what's using port 4000
   lsof -i :4000
   # Kill the process or change PORT in .env
   ```

4. **API Key Issues**
   ```bash
   # Note: API key is only required for seeding, not runtime
   # Verify seeder environment variables are loaded
   echo $DATA_PROVIDER_COINMARKETCAP_API_KEY
   echo $ASSETS_PUBLIC_URL
   
   # Check provider status (runtime)
   curl http://localhost:4000/api/price-fetching/providers/status
   ```

5. **Seeder Configuration Issues**
   ```bash
   # Required only for npm run seeder:run
   # Check seeder config validation
   echo $ASSETS_PUBLIC_URL        # Must be valid URL
   echo $DATA_PROVIDER_COINMARKETCAP_API_KEY  # Must not be empty
   
   # Run specific seeder to test
   npm run seeder:run -- --class=DataProviderSeeder
   ```

### Getting Help

- **Issues**: Report bugs via GitHub issues
- **Documentation**: Check module-specific README files
- **Logs**: Check application logs for detailed error information
- **Database**: Use `npx mikro-orm` CLI for database debugging

## Contributing

Please refer to the [Project Contributing Guidelines](../../README.md#contributing) for development standards, commit conventions, and pull request processes.

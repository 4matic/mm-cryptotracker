# CryptoTracker Backend

A NestJS backend application for tracking cryptocurrency prices and historical data using MikroORM.

## Features

- **Asset Management**: Track cryptocurrency assets with descriptions
- **Trading Pairs**: Manage trading pairs (e.g., BTC/USD, ETH/BTC)
- **Historical Data**: Store and retrieve historical price data
- **Multiple Data Providers**: Support for multiple price data sources
- **RESTful API**: Full REST API for all operations

## Database Schema

### Entities

1. **Asset**: Represents a cryptocurrency or trading asset
   - Symbol, name, description
   - Logo URL, website, market cap rank
   - Active status and timestamps

2. **TradingPair**: Represents a trading pair between two assets
   - Base and quote assets
   - Current price, volume, 24h changes
   - Price statistics and last update timestamp

3. **DataProvider**: Represents a data source for prices
   - Name, description, API configuration
   - Rate limits, priority, and status

4. **PriceHistory**: Historical price data with OHLCV format
   - Open, High, Low, Close prices
   - Volume data and trade counts
   - Time intervals and metadata

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or bun

### Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=cryptotracker

# Application Configuration
NODE_ENV=development
PORT=4000
```

### Installation

```bash
# Install dependencies
npm install

# Create database (make sure PostgreSQL is running)
createdb cryptotracker

# Generate and run migrations
cd apps/backend
npx mikro-orm migration:create --initial
npx mikro-orm migration:up
```

### Running the Application

```bash
# Development mode
nx serve backend

# Production build
nx build backend
```

## API Endpoints

### Assets
- `GET /api/assets` - List all assets with pagination
- `GET /api/assets/:id` - Get asset by ID
- `GET /api/assets/symbol/:symbol` - Get asset by symbol
- `POST /api/assets` - Create new asset

### Trading Pairs
- `GET /api/trading-pairs` - List all trading pairs with pagination
- `GET /api/trading-pairs/:id` - Get trading pair by ID
- `GET /api/trading-pairs/symbol/:symbol` - Get trading pair by symbol
- `GET /api/trading-pairs/base/:symbol` - Get pairs for base asset
- `POST /api/trading-pairs` - Create new trading pair
- `POST /api/trading-pairs/:id/price` - Update price data

### Price History
- `GET /api/price-history` - Get price history with filters
- `GET /api/price-history/latest` - Get latest price for trading pair
- `GET /api/price-history/chart` - Get chart data
- `GET /api/price-history/statistics` - Get price statistics
- `POST /api/price-history` - Create price history entry

## Database Commands

```bash
# Create new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down

# List migrations
npm run migration:list

# Create schema (development)
npm run schema:create

# Update schema (development)
npm run schema:update
```

## Architecture

The application follows NestJS best practices with:

- **Modular Architecture**: Crypto module containing all related functionality
- **Entity-Service-Controller Pattern**: Clean separation of concerns
- **MikroORM Integration**: Type-safe database operations
- **DTO Validation**: Input validation with class-validator
- **Error Handling**: Global exception filters
- **Testing**: Unit and integration tests with Jest

## Development

### Adding New Features

1. Create entities in `src/entities/`
2. Add services in `src/crypto/services/`
3. Create controllers in `src/crypto/controllers/`
4. Update the crypto module
5. Generate and run migrations

### Testing

```bash
# Run unit tests
nx test backend

# Run e2e tests
nx e2e backend
```

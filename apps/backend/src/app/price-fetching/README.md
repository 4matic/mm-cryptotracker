# Price Fetching Module

This module provides functionality for fetching cryptocurrency prices from external data providers and storing them in the database.

## Features

- **Abstract Data Provider Pattern**: Extensible architecture supporting multiple data providers
- **CoinMarketCap Integration**: Built-in support for CoinMarketCap Pro API
- **Database Integration**: Automatic storage of price data in the database
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting Awareness**: Respects provider rate limits and priorities

## Architecture

### Abstract Data Provider

The `AbstractDataProvider` class provides a common interface for all data provider implementations:

```typescript
abstract class AbstractDataProvider {
  abstract fetchPrices(request: PriceFetchRequest): Promise<PriceData[]>;
  abstract isConfigured(): boolean;
  // ... other methods
}
```

### CoinMarketCap Provider

The `CoinmarketcapDataProvider` implements the CoinMarketCap Pro API integration:

- Uses the `/v2/cryptocurrency/quotes/latest` endpoint
- Supports batch fetching of multiple symbols
- Handles API key authentication via `apiConfig.apiKey`
- Transforms API responses to internal format

## Usage

### API Endpoints

#### Fetch Specific Symbols
```
POST /price-fetching/fetch-prices
Content-Type: application/json

{
  "symbols": ["TON", "USDT"],
  "convertTo": "USD",
  "dataProviderSlug": "coinmarketcap"
}
```

#### Fetch All Active Trading Pairs
```
POST /price-fetching/fetch-all-active
Content-Type: application/json

{
  "convertTo": "USD"
}
```

#### Get Data Provider Status
```
GET /price-fetching/providers/status
```

#### Initialize Data Providers
```
POST /price-fetching/providers/initialize
```

### Service Usage

```typescript
// Inject the service
constructor(private readonly priceFetchingService: PriceFetchingService) {}

// Initialize providers
await this.priceFetchingService.initializeDataProviders();

// Fetch prices
const result = await this.priceFetchingService.fetchAndStorePrices({
  symbols: ['TON', 'USDT'],
  convertTo: 'USD'
});
```

## Configuration

### Environment Variables

Make sure to set the CoinMarketCap API key in your environment:

```bash
CMC_API_KEY=your_coinmarketcap_api_key_here
```

### Database Setup

The service requires the following entities to be properly configured:
- `DataProvider` - Data provider configurations
- `Asset` - Cryptocurrency assets
- `TradingPair` - Trading pairs
- `PriceHistory` - Price history records

### Data Provider Configuration

The CoinMarketCap provider is configured via the `DataProvider` entity:

```typescript
const coinMarketCap = new DataProvider(
  DataProviderSlug.Coinmarketcap,
  'CoinMarketCap',
  'Leading cryptocurrency market capitalization and pricing data provider'
);
coinMarketCap.apiUrl = 'https://pro-api.coinmarketcap.com';
coinMarketCap.apiConfig = {
  apiKey: process.env.CMC_API_KEY,
};
```

## Adding New Data Providers

To add a new data provider:

1. Create a new enum value in `DataProviderSlug`
2. Implement the `AbstractDataProvider` class
3. Add the provider to the factory method in `PriceFetchingService.createDataProvider()`
4. Configure the provider in the database via seeder or migration

Example:

```typescript
export class NewProviderDataProvider extends AbstractDataProvider {
  async fetchPrices(request: PriceFetchRequest): Promise<PriceData[]> {
    // Implementation
  }

  isConfigured(): boolean {
    // Validation logic
  }
}
```

## Error Handling

The service includes comprehensive error handling:

- Provider initialization errors are logged but don't stop other providers
- API request failures are caught and logged with context
- Database errors during price storage are handled per-symbol
- All errors are collected and returned in the response

## Logging

The service uses NestJS Logger with contextual information:

- Provider initialization status
- Price fetching requests and results
- Error details with stack traces
- Performance metrics (symbols processed, time taken)

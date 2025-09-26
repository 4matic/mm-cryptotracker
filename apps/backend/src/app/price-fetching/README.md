# Price Fetching Module

This module provides comprehensive functionality for fetching cryptocurrency prices from external data providers, storing them in the database, and managing the entire price data lifecycle.

## Features

- **Abstract Data Provider Pattern**: Extensible architecture supporting multiple data providers
- **CoinMarketCap Integration**: Built-in support for CoinMarketCap Pro API with comprehensive error handling
- **Automated Scheduled Fetching**: Configurable automatic price updates for all active trading pairs
- **Database Integration**: Seamless storage and retrieval of price data with MikroORM
- **Provider Priority System**: Smart fallback mechanism using provider priority rankings
- **Rate Limiting Awareness**: Respects API rate limits and provider-specific constraints
- **Comprehensive Error Handling**: Detailed error tracking and recovery mechanisms
- **Swagger Documentation**: Full OpenAPI documentation for all endpoints
- **Lifecycle Management**: Proper module initialization and cleanup

## Architecture

### Module Structure

```
price-fetching/
├── controllers/           # REST API endpoints
├── dto/                  # Data transfer objects with validation
├── interfaces/           # Abstract interfaces and contracts
├── providers/           # Data provider implementations
├── services/           # Core business logic
└── index.ts           # Module exports
```

### Abstract Data Provider

The `AbstractDataProvider` class provides a standardized interface for all external data provider integrations:

```typescript
export abstract class AbstractDataProvider {
  abstract fetchPrices(request: PriceFetchRequest): Promise<PriceData[]>;
  abstract isConfigured(): boolean;
  getRateLimit(): number;
  getPriority(): number;
  getName(): string;
  getSlug(): string;
  isActive(): boolean;
}
```

### CoinMarketCap Provider

The `CoinmarketcapDataProvider` implements comprehensive CoinMarketCap Pro API integration:

- **API Endpoint**: `/v2/cryptocurrency/quotes/latest`
- **Batch Processing**: Supports fetching multiple symbols in a single request
- **Authentication**: Secure API key handling via environment configuration
- **Data Transformation**: Converts CoinMarketCap format to internal `PriceData` structure
- **Metadata Preservation**: Stores additional market data (market cap, volume, price changes)
- **Error Recovery**: Graceful handling of API errors with detailed logging

### Price Fetching Service

The `PriceFetchingService` orchestrates the entire price fetching workflow:

- **Provider Management**: Dynamically loads and initializes data providers
- **Priority-Based Fetching**: Uses highest priority provider first with fallback options
- **Database Operations**: Handles complex price storage logic with conflict resolution
- **Scheduled Tasks**: Automatically fetches prices at configured intervals
- **Status Monitoring**: Provides real-time status of all data providers

## API Endpoints

All endpoints are documented with Swagger/OpenAPI and include comprehensive validation.

### Fetch Specific Symbols

Fetches current prices for specified cryptocurrency symbols.

```http
POST /price-fetching/fetch-prices
Content-Type: application/json

{
  "symbols": ["TON", "USDT", "BTC"],
  "convertTo": "USD",
  "dataProviderSlug": "coinmarketcap"
}
```

**Response:**
```json
{
  "success": true,
  "pricesUpdated": 3,
  "errors": [],
  "timestamp": "2025-09-25T10:30:00.000Z"
}
```

### Fetch All Active Trading Pairs

Automatically fetches prices for all active trading pairs in the system.

```http
POST /price-fetching/fetch-all-active
Content-Type: application/json

{
  "convertTo": "USD"
}
```

### Get Data Provider Status

Returns detailed status information for all configured data providers.

```http
GET /price-fetching/providers/status
```

**Response:**
```json
[
  {
    "name": "CoinMarketCap",
    "slug": "coinmarketcap",
    "isConfigured": true,
    "isActive": true,
    "priority": 1,
    "rateLimit": 1800
  }
]
```

### Initialize Data Providers

Manually triggers the initialization of all active data providers.

```http
POST /price-fetching/providers/initialize
```

## Service Usage

### Dependency Injection

```typescript
import { PriceFetchingService } from '@/price-fetching';

@Injectable()
export class YourService {
  constructor(
    private readonly priceFetchingService: PriceFetchingService
  ) {}
}
```

### Basic Price Fetching

```typescript
// Fetch specific symbols
const result = await this.priceFetchingService.fetchAndStorePrices({
  symbols: ['TON', 'USDT'],
  convertTo: 'USD'
});

// Check results
console.log(`Updated ${result.pricesUpdated} prices`);
if (result.errors.length > 0) {
  console.error('Errors:', result.errors);
}
```

### Fetch All Active Pairs

```typescript
// Fetch all active trading pairs
const result = await this.priceFetchingService.fetchAllActivePairPrices('USD');
```

### Provider Status Monitoring

```typescript
// Get current provider status
const providers = this.priceFetchingService.getDataProviderStatus();
providers.forEach(provider => {
  console.log(`${provider.name}: ${provider.isConfigured ? 'OK' : 'NOT CONFIGURED'}`);
});
```

## Configuration

### Environment Variables

Configure the CoinMarketCap API integration:

```bash
# Required: CoinMarketCap Pro API Key
DATA_PROVIDER_COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here

# Optional: Custom fetch interval (default from config)
DATA_PROVIDER_FETCH_INTERVAL_MS=300000  # 5 minutes
```

### Database Entities

The module requires these entities to be properly configured in your database:

- **`DataProvider`**: Configuration and metadata for external data providers
- **`Asset`**: Cryptocurrency assets and their properties
- **`TradingPair`**: Trading pair relationships between assets
- **`PriceHistory`**: Historical price records with full metadata

### Data Provider Configuration

CoinMarketCap provider configuration example:

```typescript
const coinMarketCap = new DataProvider(
  DataProviderSlug.Coinmarketcap,
  'CoinMarketCap',
  'Leading cryptocurrency market capitalization and pricing data provider'
);
coinMarketCap.apiUrl = 'https://pro-api.coinmarketcap.com';
coinMarketCap.apiConfig = {
  apiKey: process.env.DATA_PROVIDER_COINMARKETCAP_API_KEY,
};
coinMarketCap.priority = 1;
coinMarketCap.rateLimitPerMinute = 1800;
coinMarketCap.isActive = true;
```

### Scheduled Fetching

The module automatically sets up scheduled price fetching based on your configuration:

```typescript
// Configuration in your app config
export const dataProviderConfig = {
  fetchIntervalMs: 300000, // 5 minutes
  retryAttempts: 3,
  timeout: 15000
};
```

## Adding New Data Providers

### Step-by-Step Guide

1. **Add Provider Enum**: Update `DataProviderSlug` enum
```typescript
export enum DataProviderSlug {
  Coinmarketcap = 'coinmarketcap',
  YourNewProvider = 'your-new-provider'
}
```

2. **Implement Provider Class**: Create your provider implementation
```typescript
@Injectable()
export class YourNewProviderDataProvider extends AbstractDataProvider {
  async fetchPrices(request: PriceFetchRequest): Promise<PriceData[]> {
    // Your implementation here
    const response = await this.httpService.get(/* your API call */);
    return this.transformResponse(response.data);
  }

  isConfigured(): boolean {
    return !!this.dataProvider.apiUrl && !!this.getApiKey();
  }

  private getApiKey(): string {
    return this.dataProvider.apiConfig?.apiKey;
  }

  private transformResponse(data: any): PriceData[] {
    // Transform external format to PriceData[]
  }
}
```

3. **Register in Service**: Add to the factory method
```typescript
private createDataProvider(dataProvider: DataProvider): AbstractDataProvider {
  switch (dataProvider.slug) {
    case DataProviderSlug.Coinmarketcap:
      return CoinmarketcapDataProvider.create(dataProvider, this.httpService);
    case DataProviderSlug.YourNewProvider:
      return new YourNewProviderDataProvider(dataProvider, this.httpService);
    default:
      throw new Error(`Unsupported data provider slug: ${dataProvider.slug}`);
  }
}
```

4. **Configure in Database**: Add provider configuration via seeder or migration

## Error Handling & Recovery

### Comprehensive Error Management

The module implements multi-layered error handling:

- **Provider Level**: Individual provider errors don't affect others
- **Symbol Level**: Failed symbol fetches don't block successful ones
- **Database Level**: Storage errors are isolated per price record
- **Service Level**: All errors are collected and reported in responses

### Error Types and Recovery

```typescript
// Provider initialization errors
try {
  await this.initializeDataProviders();
} catch (error) {
  // Logged but doesn't stop application startup
}

// API request failures
try {
  const prices = await provider.fetchPrices(request);
} catch (error) {
  // Falls back to next provider in priority order
}

// Database storage errors
try {
  await this.storePriceData(priceData, provider, convertTo);
} catch (error) {
  // Error logged, continues with next price record
}
```

### Error Response Format

All endpoints return consistent error information:

```json
{
  "success": false,
  "pricesUpdated": 2,
  "errors": [
    "Failed to fetch prices from CoinMarketCap: API rate limit exceeded",
    "Base asset not found: UNKNOWN_TOKEN"
  ],
  "timestamp": "2025-09-25T10:30:00.000Z"
}
```

## Logging & Monitoring

### Structured Logging

The service provides comprehensive logging at multiple levels:

```typescript
// Initialization logging
this.logger.log(`Initializing ${activeProviders.length} active data providers`);
this.logger.log(`Initialized data provider: ${provider.name}`);

// Request logging
this.logger.log(`Fetching prices for ${symbols.length} symbols: ${symbols.join(', ')}`);
this.logger.debug(`Fetching prices from ${provider.getName()}`);

// Result logging
this.logger.log(`Successfully updated ${updated} prices from ${provider.getName()}`);
this.logger.log(`Updated ${result.pricesUpdated} prices with ${result.errors.length} errors`);

// Error logging with stack traces
this.logger.error(`Failed to fetch prices: ${errorMessage}`, errorStack);
```

### Performance Monitoring

Key metrics are automatically logged:

- **Symbols processed**: Count of successful price updates
- **Provider performance**: Success/failure rates per provider  
- **Time taken**: Duration of fetch operations
- **Error rates**: Categorized error statistics

### Health Checks

Monitor system health through:

- Provider status endpoint
- Recent price update timestamps
- Error rate monitoring
- Database connectivity checks

## Module Dependencies

### NestJS Modules

```typescript
@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 3,
    }),
    MikroOrmModule.forFeature([DataProvider, TradingPair, PriceHistory, Asset]),
    ConfigModule,
  ],
  controllers: [PriceFetchingController],
  providers: [PriceFetchingService],
  exports: [PriceFetchingService],
})
```

### External Dependencies

- **@nestjs/axios**: HTTP client for external API calls
- **@mikro-orm/nestjs**: Database ORM integration
- **@nestjs/config**: Configuration management
- **@nestjs/schedule**: Scheduled task management
- **class-validator**: DTO validation
- **@nestjs/swagger**: API documentation

## Best Practices

### Security
- Store API keys securely in environment variables
- Use HTTPS for all external API calls
- Implement proper request timeouts and retries
- Validate all input data with DTOs

### Performance
- Use batch API calls when available
- Implement proper caching strategies
- Monitor and respect API rate limits
- Use database transactions for consistency

### Reliability
- Implement fallback providers
- Use proper error handling and logging
- Set up monitoring and alerting
- Regularly test provider configurations

### Maintainability
- Follow the abstract provider pattern for new integrations
- Use proper TypeScript typing
- Write comprehensive tests
- Document configuration requirements

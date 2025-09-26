import { Controller, Post, Get, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceFetchingService } from '../services/price-fetching.service';
import {
  FetchPricesDto,
  FetchAllActivePairsDto,
} from '../dto/fetch-prices.dto';
import {
  FetchPricesResponseDto,
  DataProviderStatusDto,
} from '../dto/fetch-prices-response.dto';

/**
 * Controller for price fetching operations
 */
@ApiTags('Price Fetching')
@Controller('price-fetching')
export class PriceFetchingController {
  private readonly logger = new Logger(PriceFetchingController.name);

  constructor(private readonly priceFetchingService: PriceFetchingService) {}

  /**
   * Fetches prices for specified symbols
   */
  @Post('fetch-prices')
  @ApiOperation({
    summary: 'Fetch prices for specified cryptocurrency symbols',
    description:
      'Fetches current prices for the specified cryptocurrency symbols and stores them in the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Prices fetched successfully',
    type: FetchPricesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
  })
  async fetchPrices(
    @Body() fetchPricesDto: FetchPricesDto
  ): Promise<FetchPricesResponseDto> {
    this.logger.log(
      `Received request to fetch prices for symbols: ${fetchPricesDto.symbols.join(
        ', '
      )}`
    );

    const result = await this.priceFetchingService.fetchAndStorePrices({
      symbols: fetchPricesDto.symbols,
      convertTo: fetchPricesDto.convertTo,
      dataProviderSlug: fetchPricesDto.dataProviderSlug,
    });

    this.logger.log(
      `Price fetching completed. Updated ${result.pricesUpdated} prices with ${result.errors.length} errors`
    );

    return result;
  }

  /**
   * Fetches prices for all active trading pairs
   */
  @Post('fetch-all-active')
  @ApiOperation({
    summary: 'Fetch prices for all active trading pairs',
    description:
      'Fetches current prices for all active trading pairs in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Prices fetched successfully',
    type: FetchPricesResponseDto,
  })
  async fetchAllActivePairs(
    @Body() fetchAllDto: FetchAllActivePairsDto
  ): Promise<FetchPricesResponseDto> {
    this.logger.log('Received request to fetch prices for all active pairs');

    const result = await this.priceFetchingService.fetchAllActivePairPrices(
      fetchAllDto.convertTo
    );

    return result;
  }

  /**
   * Gets the status of all data providers
   */
  @Get('providers/status')
  @ApiOperation({
    summary: 'Get status of all data providers',
    description: 'Returns the configuration and status of all data providers',
  })
  @ApiResponse({
    status: 200,
    description: 'Data provider status retrieved successfully',
    type: [DataProviderStatusDto],
  })
  async getDataProviderStatus(): Promise<DataProviderStatusDto[]> {
    return this.priceFetchingService.getDataProviderStatus();
  }

  /**
   * Initializes all data providers
   */
  @Post('providers/initialize')
  @ApiOperation({
    summary: 'Initialize data providers',
    description:
      'Initializes all active data providers by loading their configurations',
  })
  @ApiResponse({
    status: 200,
    description: 'Data providers initialized successfully',
  })
  async initializeDataProviders(): Promise<{ message: string }> {
    this.logger.log('Received request to initialize data providers');

    await this.priceFetchingService.initializeDataProviders();

    return { message: 'Data providers initialized successfully' };
  }
}

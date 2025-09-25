import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  PriceHistoryService,
  PriceHistoryQuery,
} from '@/app/crypto/services/price-history.service';
import { PriceHistory } from '@/entities/price-history.entity';
import {
  UpdatePriceDto,
  PriceStatisticsResponseDto,
  AdminTestResponseDto,
} from '@/app/crypto/dto/price-history.dto';

/**
 * Controller for managing price history data
 */
@ApiTags('Price History')
@Controller('price-history')
export class PriceHistoryController {
  private readonly logger = new Logger(PriceHistoryController.name);

  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  /**
   * Gets price history with filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get price history',
    description:
      'Retrieves price history entries with optional filtering by trading pair, data provider, date range, and limit',
  })
  @ApiQuery({
    name: 'tradingPairId',
    required: false,
    description: 'Filter by trading pair ID',
    example: 1,
  })
  @ApiQuery({
    name: 'dataProviderId',
    required: false,
    description: 'Filter by data provider ID',
    example: 1,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records to return',
    example: 100,
  })
  @ApiResponse({
    status: 200,
    description: 'Price history retrieved successfully',
    type: [PriceHistory],
  })
  async getPriceHistory(
    @Query('tradingPairId') tradingPairId?: number,
    @Query('dataProviderId') dataProviderId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number
  ): Promise<PriceHistory[]> {
    this.logger.log(
      `Fetching price history - tradingPairId: ${tradingPairId}, dataProviderId: ${dataProviderId}, startDate: ${startDate}, endDate: ${endDate}, limit: ${limit}`
    );

    const query: PriceHistoryQuery = {
      tradingPairId,
      dataProviderId,
      limit,
    };

    if (startDate) {
      query.startDate = new Date(startDate);
    }

    if (endDate) {
      query.endDate = new Date(endDate);
    }

    const results = await this.priceHistoryService.findPriceHistory(query);

    this.logger.log(`Retrieved ${results.length} price history entries`);

    return results;
  }

  /**
   * Gets the latest price for a trading pair
   */
  @Get('latest')
  @ApiOperation({
    summary: 'Get latest price for a trading pair',
    description:
      'Retrieves the most recent price entry for a specific trading pair',
  })
  @ApiQuery({
    name: 'tradingPairId',
    description: 'Trading pair ID',
    example: 1,
  })
  @ApiQuery({
    name: 'dataProviderId',
    required: false,
    description: 'Data provider ID (optional)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Latest price retrieved successfully',
    type: PriceHistory,
  })
  @ApiResponse({
    status: 404,
    description: 'No price data found for the trading pair',
  })
  async getLatestPrice(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<PriceHistory | null> {
    this.logger.log(
      `Fetching latest price for trading pair ${tradingPairId}, dataProvider: ${dataProviderId}`
    );

    const result = await this.priceHistoryService.getLatestPrice(
      tradingPairId,
      dataProviderId
    );

    if (result) {
      this.logger.log(
        `Found latest price: ${result.price} for trading pair ${tradingPairId}`
      );
    } else {
      this.logger.warn(`No price data found for trading pair ${tradingPairId}`);
    }

    return result;
  }

  /**
   * Gets chart data for a trading pair
   */
  @Get('chart')
  @ApiOperation({
    summary: 'Get chart data for a trading pair',
    description:
      'Retrieves price history data formatted for chart display within a specified date range',
  })
  @ApiQuery({
    name: 'tradingPairId',
    description: 'Trading pair ID',
    example: 1,
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for chart data (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for chart data (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'dataProviderId',
    required: false,
    description: 'Data provider ID (optional)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Chart data retrieved successfully',
    type: [PriceHistory],
  })
  async getChartData(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<PriceHistory[]> {
    this.logger.log(
      `Fetching chart data for trading pair ${tradingPairId} from ${startDate} to ${endDate}`
    );

    const results = await this.priceHistoryService.getChartData(
      tradingPairId,
      new Date(startDate),
      new Date(endDate),
      dataProviderId
    );

    this.logger.log(
      `Retrieved ${results.length} chart data points for trading pair ${tradingPairId}`
    );

    return results;
  }

  /**
   * Gets price statistics for a time period
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get price statistics for a time period',
    description:
      'Retrieves statistical data (high, low, first, last, count) for a trading pair within a specified date range',
  })
  @ApiQuery({
    name: 'tradingPairId',
    description: 'Trading pair ID',
    example: 1,
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date for statistics (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date for statistics (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'dataProviderId',
    required: false,
    description: 'Data provider ID (optional)',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Price statistics retrieved successfully',
    type: PriceStatisticsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No price data found for the specified period',
  })
  async getPriceStatistics(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<{
    high: string;
    low: string;
    first: string;
    last: string;
    count: number;
  } | null> {
    this.logger.log(
      `Fetching price statistics for trading pair ${tradingPairId} from ${startDate} to ${endDate}`
    );

    const result = await this.priceHistoryService.getPriceStatistics(
      tradingPairId,
      new Date(startDate),
      new Date(endDate),
      dataProviderId
    );

    if (result) {
      this.logger.log(
        `Retrieved price statistics for trading pair ${tradingPairId}: high=${result.high}, low=${result.low}, count=${result.count}`
      );
    } else {
      this.logger.warn(
        `No price statistics found for trading pair ${tradingPairId} in the specified period`
      );
    }

    return result;
  }

  /**
   * Admin test endpoint
   */
  @Get('admin/test')
  @ApiOperation({
    summary: 'Admin test endpoint',
    description: 'Health check endpoint for the price history controller',
  })
  @ApiResponse({
    status: 200,
    description: 'Controller is working properly',
    type: AdminTestResponseDto,
  })
  async adminTest(): Promise<{ message: string; timestamp: string }> {
    this.logger.log('Admin test endpoint called');

    return {
      message: 'Price history controller is working',
      timestamp: new Date().toISOString(),
    };
  }
}

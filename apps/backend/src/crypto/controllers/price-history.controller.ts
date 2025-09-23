import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  PriceHistoryService,
  PriceHistoryQuery,
} from '@/crypto/services/price-history.service';
import { PriceHistory, TimeInterval } from '@/entities/price-history.entity';

export class CreatePriceHistoryDto {
  tradingPairId!: number;
  dataProviderId!: number;
  timestamp!: Date;
  openPrice!: string;
  highPrice!: string;
  lowPrice!: string;
  closePrice!: string;
  interval?: TimeInterval;
  volume?: string;
  volumeQuote?: string;
  tradesCount?: number;
}

/**
 * Controller for managing price history data
 */
@Controller('price-history')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  /**
   * Creates a new price history entry
   */
  @Post()
  async createPriceHistory(
    @Body() createPriceHistoryDto: CreatePriceHistoryDto
  ): Promise<PriceHistory | null> {
    return this.priceHistoryService.createPriceHistory(
      createPriceHistoryDto.tradingPairId,
      createPriceHistoryDto.dataProviderId,
      createPriceHistoryDto.timestamp,
      createPriceHistoryDto.openPrice,
      createPriceHistoryDto.highPrice,
      createPriceHistoryDto.lowPrice,
      createPriceHistoryDto.closePrice,
      createPriceHistoryDto.interval,
      createPriceHistoryDto.volume,
      createPriceHistoryDto.volumeQuote,
      createPriceHistoryDto.tradesCount
    );
  }

  /**
   * Gets price history with filtering
   */
  @Get()
  async getPriceHistory(
    @Query('tradingPairId') tradingPairId?: number,
    @Query('dataProviderId') dataProviderId?: number,
    @Query('interval') interval?: TimeInterval,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: number
  ): Promise<PriceHistory[]> {
    const query: PriceHistoryQuery = {
      tradingPairId,
      dataProviderId,
      interval,
      limit,
    };

    if (startDate) {
      query.startDate = new Date(startDate);
    }

    if (endDate) {
      query.endDate = new Date(endDate);
    }

    return this.priceHistoryService.findPriceHistory(query);
  }

  /**
   * Gets the latest price for a trading pair
   */
  @Get('latest')
  async getLatestPrice(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<PriceHistory | null> {
    return this.priceHistoryService.getLatestPrice(
      tradingPairId,
      dataProviderId
    );
  }

  /**
   * Gets chart data for a trading pair
   */
  @Get('chart')
  async getChartData(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('interval') interval: TimeInterval,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<PriceHistory[]> {
    return this.priceHistoryService.getChartData(
      tradingPairId,
      interval,
      new Date(startDate),
      new Date(endDate),
      dataProviderId
    );
  }

  /**
   * Gets price statistics for a time period
   */
  @Get('statistics')
  async getPriceStatistics(
    @Query('tradingPairId', ParseIntPipe) tradingPairId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dataProviderId') dataProviderId?: number
  ): Promise<{
    high: string;
    low: string;
    open: string;
    close: string;
    volume: string;
    count: number;
  } | null> {
    return this.priceHistoryService.getPriceStatistics(
      tradingPairId,
      new Date(startDate),
      new Date(endDate),
      dataProviderId
    );
  }

  /**
   * Admin test endpoint
   */
  @Get('admin/test')
  async adminTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Price history controller is working',
      timestamp: new Date().toISOString(),
    };
  }
}

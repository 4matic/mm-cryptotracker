import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TradingPairService } from '@/app/crypto/services/trading-pair.service';
import { TradingPair } from '@/entities/trading-pair.entity';

export class CreateTradingPairDto {
  baseSymbol!: string;
  quoteSymbol!: string;
}

/**
 * Controller for managing trading pairs
 */
@Controller('trading-pairs')
export class TradingPairController {
  constructor(private readonly tradingPairService: TradingPairService) {}

  /**
   * Creates a new trading pair
   */
  @Post()
  async createTradingPair(
    @Body() createTradingPairDto: CreateTradingPairDto
  ): Promise<TradingPair | null> {
    return this.tradingPairService.createTradingPair(
      createTradingPairDto.baseSymbol,
      createTradingPairDto.quoteSymbol
    );
  }

  /**
   * Gets all active trading pairs with pagination
   */
  @Get()
  async getTradingPairs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('isVisible') isVisible?: boolean
  ): Promise<{
    pairs: TradingPair[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.tradingPairService.findWithPagination(
      page,
      limit,
      isVisible
    );
    return {
      ...result,
      page,
      limit,
    };
  }

  /**
   * Gets a trading pair by ID
   */
  @Get(':id')
  async getTradingPairById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<TradingPair | null> {
    return this.tradingPairService.findById(id);
  }

  /**
   * Gets a trading pair by symbol
   */
  @Get('symbol/:symbol')
  async getTradingPairBySymbol(
    @Param('symbol') symbol: string
  ): Promise<TradingPair | null> {
    return this.tradingPairService.findBySymbol(symbol);
  }

  /**
   * Gets trading pairs for a specific base asset
   */
  @Get('base/:symbol')
  async getTradingPairsByBaseAsset(
    @Param('symbol') symbol: string
  ): Promise<TradingPair[]> {
    return this.tradingPairService.findByBaseAsset(symbol);
  }

  /**
   * Toggles the active status of a trading pair
   */
  @Patch(':id/toggle-active')
  async toggleActiveStatus(
    @Param('id', ParseIntPipe) id: number
  ): Promise<TradingPair | null> {
    return this.tradingPairService.toggleActiveStatus(id);
  }

  /**
   * Admin test endpoint
   */
  @Get('admin/test')
  async adminTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Trading pair controller is working',
      timestamp: new Date().toISOString(),
    };
  }
}

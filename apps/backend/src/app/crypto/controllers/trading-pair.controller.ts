import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TradingPairService } from '@/app/crypto/services/trading-pair.service';
import { TradingPair } from '@/entities/trading-pair.entity';
import { PaginatedTradingPairsResponseDto } from '@/app/crypto/dto/trading-pair.dto';

/**
 * Controller for managing trading pairs
 */
@ApiTags('Trading Pairs')
@Controller('trading-pairs')
export class TradingPairController {
  private readonly logger = new Logger(TradingPairController.name);

  constructor(private readonly tradingPairService: TradingPairService) {}

  /**
   * Gets all active trading pairs with pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all trading pairs',
    description:
      'Retrieves a paginated list of trading pairs with optional visibility filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 20)',
    example: 20,
  })
  @ApiQuery({
    name: 'isVisible',
    required: false,
    description: 'Filter by visibility status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Trading pairs retrieved successfully',
    type: PaginatedTradingPairsResponseDto,
  })
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
    this.logger.log(
      `Fetching trading pairs - page: ${page}, limit: ${limit}, isVisible: ${isVisible}`
    );

    const result = await this.tradingPairService.findWithPagination(
      page,
      limit,
      isVisible
    );

    this.logger.log(
      `Retrieved ${result.pairs.length} trading pairs out of ${result.total} total`
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
  @ApiOperation({
    summary: 'Get trading pair by ID',
    description: 'Retrieves a specific trading pair by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Trading pair ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Trading pair found',
    type: TradingPair,
  })
  @ApiResponse({
    status: 404,
    description: 'Trading pair not found',
  })
  async getTradingPairById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<TradingPair | null> {
    this.logger.log(`Fetching trading pair by ID: ${id}`);

    const pair = await this.tradingPairService.findById(id);

    if (pair) {
      this.logger.log(`Found trading pair: ${pair.symbol} (ID: ${id})`);
    } else {
      this.logger.warn(`Trading pair not found with ID: ${id}`);
    }

    return pair;
  }

  /**
   * Gets a trading pair by symbol
   */
  @Get('symbol/:symbol')
  @ApiOperation({
    summary: 'Get trading pair by symbol',
    description:
      'Retrieves a specific trading pair by its symbol (e.g., BTC/USD)',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Trading pair symbol',
    example: 'BTC/USD',
  })
  @ApiResponse({
    status: 200,
    description: 'Trading pair found',
    type: TradingPair,
  })
  @ApiResponse({
    status: 404,
    description: 'Trading pair not found',
  })
  async getTradingPairBySymbol(
    @Param('symbol') symbol: string
  ): Promise<TradingPair | null> {
    this.logger.log(`Fetching trading pair by symbol: ${symbol}`);

    const pair = await this.tradingPairService.findBySymbol(symbol);

    if (pair) {
      this.logger.log(`Found trading pair: ${pair.symbol}`);
    } else {
      this.logger.warn(`Trading pair not found with symbol: ${symbol}`);
    }

    return pair;
  }

  /**
   * Gets trading pairs for a specific base asset
   */
  @Get('base/:symbol')
  @ApiOperation({
    summary: 'Get trading pairs by base asset',
    description:
      'Retrieves all trading pairs that have the specified symbol as the base asset',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Base asset symbol',
    example: 'BTC',
  })
  @ApiResponse({
    status: 200,
    description: 'Trading pairs retrieved successfully',
    type: [TradingPair],
  })
  async getTradingPairsByBaseAsset(
    @Param('symbol') symbol: string
  ): Promise<TradingPair[]> {
    this.logger.log(`Fetching trading pairs for base asset: ${symbol}`);

    const pairs = await this.tradingPairService.findByBaseAsset(symbol);

    this.logger.log(
      `Found ${pairs.length} trading pairs for base asset: ${symbol}`
    );

    return pairs;
  }
}

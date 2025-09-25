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
import { AssetService } from '@/app/crypto/services/asset.service';
import { Asset } from '@/entities/asset.entity';
import { PaginatedAssetsResponseDto } from '@/app/crypto/dto/asset.dto';

/**
 * Controller for managing cryptocurrency assets
 */
@ApiTags('Assets')
@Controller('assets')
export class AssetController {
  private readonly logger = new Logger(AssetController.name);

  constructor(private readonly assetService: AssetService) {}

  /**
   * Gets all active assets with pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all active assets',
    description:
      'Retrieves a paginated list of all active cryptocurrency assets',
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
  @ApiResponse({
    status: 200,
    description: 'Assets retrieved successfully',
    type: PaginatedAssetsResponseDto,
  })
  async getAssets(
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ): Promise<{ assets: Asset[]; total: number; page: number; limit: number }> {
    this.logger.log(`Fetching assets - page: ${page}, limit: ${limit}`);

    const result = await this.assetService.findWithPagination(page, limit);

    this.logger.log(
      `Retrieved ${result.assets.length} assets out of ${result.total} total`
    );

    return {
      ...result,
      page,
      limit,
    };
  }

  /**
   * Gets an asset by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get asset by ID',
    description: 'Retrieves a specific asset by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Asset ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Asset found',
    type: Asset,
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found',
  })
  async getAssetById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Asset | null> {
    this.logger.log(`Fetching asset by ID: ${id}`);

    const asset = await this.assetService.findById(id);

    if (asset) {
      this.logger.log(`Found asset: ${asset.symbol} (ID: ${id})`);
    } else {
      this.logger.warn(`Asset not found with ID: ${id}`);
    }

    return asset;
  }

  /**
   * Gets an asset by symbol
   */
  @Get('symbol/:symbol')
  @ApiOperation({
    summary: 'Get asset by symbol',
    description: 'Retrieves a specific asset by its symbol (e.g., BTC, ETH)',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Asset symbol',
    example: 'BTC',
  })
  @ApiResponse({
    status: 200,
    description: 'Asset found',
    type: Asset,
  })
  @ApiResponse({
    status: 404,
    description: 'Asset not found',
  })
  async getAssetBySymbol(
    @Param('symbol') symbol: string
  ): Promise<Asset | null> {
    this.logger.log(`Fetching asset by symbol: ${symbol}`);

    const asset = await this.assetService.findBySymbol(symbol);

    if (asset) {
      this.logger.log(`Found asset: ${asset.symbol} (${asset.name})`);
    } else {
      this.logger.warn(`Asset not found with symbol: ${symbol}`);
    }

    return asset;
  }
}

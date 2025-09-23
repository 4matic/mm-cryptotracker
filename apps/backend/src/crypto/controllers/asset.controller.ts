import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AssetService } from '@/crypto/services/asset.service';
import { Asset } from '@/entities/asset.entity';

export class CreateAssetDto {
  symbol!: string;
  name!: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

/**
 * Controller for managing cryptocurrency assets
 */
@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  /**
   * Creates a new asset
   */
  @Post()
  async createAsset(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetService.createAsset(
      createAssetDto.symbol,
      createAssetDto.name,
      createAssetDto.description
    );
  }

  /**
   * Gets all active assets with pagination
   */
  @Get()
  async getAssets(
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ): Promise<{ assets: Asset[]; total: number; page: number; limit: number }> {
    const result = await this.assetService.findWithPagination(page, limit);
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
  async getAssetById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Asset | null> {
    return this.assetService.findById(id);
  }

  /**
   * Gets an asset by symbol
   */
  @Get('symbol/:symbol')
  async getAssetBySymbol(
    @Param('symbol') symbol: string
  ): Promise<Asset | null> {
    return this.assetService.findBySymbol(symbol);
  }

  /**
   * Admin test endpoint
   */
  @Get('admin/test')
  async adminTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Asset controller is working',
      timestamp: new Date().toISOString(),
    };
  }
}

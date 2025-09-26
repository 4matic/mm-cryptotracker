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
import { DataProviderService } from '@/app/crypto/services/data-provider.service';
import { DataProvider } from '@/entities/data-provider.entity';
import { PaginatedDataProvidersResponseDto } from '@/app/crypto/dto/data-provider.dto';

/**
 * Controller for managing data providers
 */
@ApiTags('Data Providers')
@Controller('data-providers')
export class DataProviderController {
  private readonly logger = new Logger(DataProviderController.name);

  constructor(private readonly dataProviderService: DataProviderService) {}

  /**
   * Gets all data providers with pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all data providers',
    description:
      'Retrieves a paginated list of data providers with optional filtering by active status',
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
    name: 'activeOnly',
    required: false,
    description: 'Filter by active status (default: true)',
    example: true,
    type: 'boolean',
  })
  @ApiResponse({
    status: 200,
    description: 'Data providers retrieved successfully',
    type: PaginatedDataProvidersResponseDto,
  })
  async getDataProviders(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('activeOnly') activeOnly = true
  ): Promise<{
    dataProviders: DataProvider[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(
      `Fetching data providers - page: ${page}, limit: ${limit}, activeOnly: ${activeOnly}`
    );

    const result = await this.dataProviderService.findWithPagination(
      page,
      limit,
      activeOnly
    );

    this.logger.log(
      `Retrieved ${result.dataProviders.length} data providers out of ${result.total} total`
    );

    return {
      ...result,
      page,
      limit,
    };
  }

  /**
   * Gets a data provider by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get data provider by ID',
    description: 'Retrieves a specific data provider by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Data provider ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Data provider found',
    type: DataProvider,
  })
  @ApiResponse({
    status: 404,
    description: 'Data provider not found',
  })
  async getDataProviderById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<DataProvider | null> {
    this.logger.log(`Fetching data provider by ID: ${id}`);

    const dataProvider = await this.dataProviderService.findById(id);

    if (dataProvider) {
      this.logger.log(`Found data provider: ${dataProvider.name} (ID: ${id})`);
    } else {
      this.logger.warn(`Data provider not found with ID: ${id}`);
    }

    return dataProvider;
  }

  /**
   * Gets a data provider by slug
   */
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get data provider by slug',
    description:
      'Retrieves a specific data provider by its slug (e.g., binance, coingecko)',
  })
  @ApiParam({
    name: 'slug',
    description: 'Data provider slug',
    example: 'binance',
  })
  @ApiResponse({
    status: 200,
    description: 'Data provider found',
    type: DataProvider,
  })
  @ApiResponse({
    status: 404,
    description: 'Data provider not found',
  })
  async getDataProviderBySlug(
    @Param('slug') slug: string
  ): Promise<DataProvider | null> {
    this.logger.log(`Fetching data provider by slug: ${slug}`);

    const dataProvider = await this.dataProviderService.findBySlug(slug);

    if (dataProvider) {
      this.logger.log(
        `Found data provider: ${dataProvider.name} (${dataProvider.slug})`
      );
    } else {
      this.logger.warn(`Data provider not found with slug: ${slug}`);
    }

    return dataProvider;
  }
}

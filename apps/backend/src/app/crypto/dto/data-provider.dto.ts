import { ApiProperty } from '@nestjs/swagger';
import { DataProvider } from '@/app/crypto/entities/data-provider.entity';

/**
 * DTO for data provider response (excludes sensitive apiConfig)
 */
export class DataProviderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the data provider',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'URL-friendly slug for the data provider',
    example: 'binance',
  })
  slug!: string;

  @ApiProperty({
    description: 'Display name of the data provider',
    example: 'Binance',
  })
  name!: string;

  @ApiProperty({
    description: 'Description of the data provider',
    example: 'Major cryptocurrency exchange providing real-time price data',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'API URL for the data provider',
    example: 'https://api.binance.com',
    required: false,
  })
  apiUrl?: string;

  @ApiProperty({
    description: 'Official website URL',
    example: 'https://binance.com',
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: 'Whether the data provider is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Rate limit for API calls per minute',
    example: 30,
  })
  rateLimitPerMinute!: number;

  @ApiProperty({
    description: 'Priority level for data provider (higher = more priority)',
    example: 1,
  })
  priority!: number;

  @ApiProperty({
    description: 'Data provider creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Data provider last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  /**
   * Creates a response DTO from a DataProvider entity, excluding sensitive apiConfig
   */
  static fromEntity(entity: DataProvider): DataProviderResponseDto {
    const dto = new DataProviderResponseDto();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.apiUrl = entity.apiUrl;
    dto.website = entity.website;
    dto.isActive = entity.isActive;
    dto.rateLimitPerMinute = entity.rateLimitPerMinute;
    dto.priority = entity.priority;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

/**
 * DTO for paginated data provider response
 */
export class PaginatedDataProvidersResponseDto {
  @ApiProperty({
    description: 'Array of data providers',
    type: [DataProviderResponseDto],
  })
  dataProviders!: DataProviderResponseDto[];

  @ApiProperty({
    description: 'Total number of data providers',
    example: 10,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit!: number;
}

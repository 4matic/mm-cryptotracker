import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for price fetching response
 */
export class FetchPricesResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Number of prices that were updated',
    example: 4,
  })
  pricesUpdated!: number;

  @ApiProperty({
    description: 'Array of error messages if any occurred',
    example: [],
    type: [String],
  })
  errors!: string[];

  @ApiProperty({
    description: 'Timestamp when the operation completed',
    example: '2025-09-25T10:30:00.000Z',
  })
  timestamp!: Date;
}

/**
 * DTO for data provider status
 */
export class DataProviderStatusDto {
  @ApiProperty({
    description: 'Name of the data provider',
    example: 'CoinMarketCap',
  })
  name!: string;

  @ApiProperty({
    description: 'Slug identifier of the data provider',
    example: 'coinmarketcap',
  })
  slug!: string;

  @ApiProperty({
    description: 'Whether the provider is properly configured',
    example: true,
  })
  isConfigured!: boolean;

  @ApiProperty({
    description: 'Whether the provider is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Priority level of the provider (higher is better)',
    example: 1,
  })
  priority!: number;

  @ApiProperty({
    description: 'Rate limit per minute for this provider',
    example: 1800,
  })
  rateLimit!: number;
}

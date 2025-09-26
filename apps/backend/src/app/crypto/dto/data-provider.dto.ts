import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for paginated data provider response
 */
export class PaginatedDataProvidersResponseDto {
  @ApiProperty({
    description: 'Array of data providers',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        slug: { type: 'string', example: 'binance' },
        name: { type: 'string', example: 'Binance' },
        description: {
          type: 'string',
          example:
            'Major cryptocurrency exchange providing real-time price data',
        },
        apiUrl: { type: 'string', example: 'https://api.binance.com' },
        website: { type: 'string', example: 'https://binance.com' },
        isActive: { type: 'boolean', example: true },
        rateLimitPerMinute: { type: 'number', example: 30 },
        priority: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  dataProviders!: object[];

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

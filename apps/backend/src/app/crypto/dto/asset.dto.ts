import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for paginated asset response
 */
export class PaginatedAssetsResponseDto {
  @ApiProperty({
    description: 'Array of assets',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        symbol: { type: 'string', example: 'BTC' },
        name: { type: 'string', example: 'Bitcoin' },
        description: { type: 'string', example: 'The first cryptocurrency' },
        logoUrl: { type: 'string', example: 'https://example.com/logo.png' },
        website: { type: 'string', example: 'https://bitcoin.org' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  assets!: object[];

  @ApiProperty({
    description: 'Total number of assets',
    example: 100,
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

import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for paginated trading pairs response
 */
export class PaginatedTradingPairsResponseDto {
  @ApiProperty({
    description: 'Array of trading pairs',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        symbol: { type: 'string', example: 'BTC/USD' },
        baseAsset: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            symbol: { type: 'string', example: 'BTC' },
            name: { type: 'string', example: 'Bitcoin' },
          },
        },
        quoteAsset: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            symbol: { type: 'string', example: 'USD' },
            name: { type: 'string', example: 'US Dollar' },
          },
        },
        isActive: { type: 'boolean', example: true },
        isVisible: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  pairs!: any[];

  @ApiProperty({
    description: 'Total number of trading pairs',
    example: 50,
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

/**
 * DTO for trading pairs query parameters
 */
export class TradingPairsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Filter by visibility status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isVisible?: boolean;
}

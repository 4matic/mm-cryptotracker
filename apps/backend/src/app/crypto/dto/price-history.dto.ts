import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * DTO for price history query parameters
 */
export class PriceHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by trading pair ID',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  tradingPairId?: number;

  @ApiPropertyOptional({
    description: 'Filter by data provider ID',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  dataProviderId?: number;

  @ApiPropertyOptional({
    description: 'Start date for filtering (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of records to return',
    example: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}

/**
 * DTO for latest price query parameters
 */
export class LatestPriceQueryDto {
  @ApiProperty({
    description: 'Trading pair ID',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  tradingPairId!: number;

  @ApiPropertyOptional({
    description: 'Data provider ID (optional)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  dataProviderId?: number;
}

/**
 * DTO for chart data query parameters
 */
export class ChartDataQueryDto {
  @ApiProperty({
    description: 'Trading pair ID',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  tradingPairId!: number;

  @ApiProperty({
    description: 'Start date for chart data (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'End date for chart data (ISO 8601 format)',
    example: '2024-01-31T23:59:59.999Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({
    description: 'Data provider ID (optional)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  dataProviderId?: number;
}

/**
 * DTO for price statistics response
 */
export class PriceStatisticsResponseDto {
  @ApiProperty({
    description: 'Highest price in the period',
    example: '52000.00',
  })
  high!: string;

  @ApiProperty({
    description: 'Lowest price in the period',
    example: '48000.00',
  })
  low!: string;

  @ApiProperty({
    description: 'First price in the period',
    example: '50000.00',
  })
  first!: string;

  @ApiProperty({
    description: 'Last price in the period',
    example: '51000.00',
  })
  last!: string;

  @ApiProperty({
    description: 'Number of price entries in the period',
    example: 100,
  })
  count!: number;
}

/**
 * DTO for admin test response
 */
export class AdminTestResponseDto {
  @ApiProperty({
    description: 'Test message',
    example: 'Price history controller is working',
  })
  message!: string;

  @ApiProperty({
    description: 'Current timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp!: string;
}

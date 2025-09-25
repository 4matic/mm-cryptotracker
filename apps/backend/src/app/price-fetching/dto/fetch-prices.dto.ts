import { IsArray, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataProviderSlug } from '@/enums/data-provider.enum';

/**
 * DTO for fetching prices request
 */
export class FetchPricesDto {
  @ApiProperty({
    description: 'Array of cryptocurrency symbols to fetch prices for',
    example: ['TON', 'USDT'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  symbols!: string[];

  @ApiProperty({
    description: 'Currency to convert prices to',
    example: 'USD',
    default: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  convertTo?: string;

  @ApiProperty({
    description: 'Specific data provider to use (optional)',
    enum: DataProviderSlug,
    required: false,
  })
  @IsOptional()
  @IsEnum(DataProviderSlug)
  dataProviderSlug?: DataProviderSlug;
}

/**
 * DTO for fetch all active pairs request
 */
export class FetchAllActivePairsDto {
  @ApiProperty({
    description: 'Currency to convert prices to',
    example: 'USD',
    default: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  convertTo?: string;
}

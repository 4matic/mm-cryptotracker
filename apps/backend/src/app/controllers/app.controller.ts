import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AppService,
  type HealthCheckResponse,
} from '@/app/services/app.service';

/**
 * Main application controller
 */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   */
  @Get('healthcheck')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the health status of the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          example: '2024-01-01T00:00:00.000Z',
        },
        uptime: {
          type: 'number',
          example: 123.456,
        },
      },
    },
  })
  getHealthCheck(): HealthCheckResponse {
    return this.appService.getHealthCheck();
  }
}

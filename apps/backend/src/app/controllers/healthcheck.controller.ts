import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Controller for application health check
 */
@ApiTags('Health')
@Controller()
export class HealthcheckController {
  private readonly logger = new Logger(HealthcheckController.name);

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
  getHealthCheck(): {
    status: string;
    timestamp: string;
    uptime: number;
  } {
    this.logger.log('Health check requested');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

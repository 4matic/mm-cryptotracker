import { Injectable, Logger } from '@nestjs/common';

/**
 * Health check response interface
 */
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

/**
 * Main application service
 */
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  /**
   * Get application health status
   * @returns Health check information
   */
  getHealthCheck(): HealthCheckResponse {
    this.logger.log('Health check requested');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

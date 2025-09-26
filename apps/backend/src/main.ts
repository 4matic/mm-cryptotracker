import { join } from 'path';
import { pino } from 'pino';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import appConfig from '@/config/app.config';

async function bootstrap() {
  const config = appConfig();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      loggerInstance: pino({
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
    })
  );
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MM CryptoTracker API')
    .setDescription(
      'API to track cryptocurrency prices with detailed analysis and historical data'
    )
    .setVersion('1.0')
    .addTag('CryptoTracker')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const port = config.port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

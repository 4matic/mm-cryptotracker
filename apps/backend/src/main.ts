import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app/app.module';

async function bootstrap() {
  // <NestFastifyApplication>
  const app = await NestFactory.create(
    AppModule,
    {
      // logger: new ConsoleLogger({
      //   timestamp: true,
      //   json: true,
      // }),
    }
    // new FastifyAdapter({
    //   logger: {
    //     level: 'debug',
    //   },
    // })
  );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

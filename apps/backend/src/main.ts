import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppModule } from '@/app/app.module';
import { join } from 'path';

async function bootstrap() {
  // <NestFastifyApplication>
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        level: 'debug',
      },
    })
    // {
    //   // logger: new ConsoleLogger({
    //   //   timestamp: true,
    //   //   json: true,
    //   // }),
    // }
  );
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '',
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

import { Environment } from './env';
import { ApiModule } from './api/api.module';

const logger = new Logger('GeoipApplication');

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    new FastifyAdapter(),
  );

  const validation = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });

  app.useGlobalPipes(validation);

  if (Environment.NODE_ENV !== 'production') {
    const config = new DocumentBuilder().setVersion('0.0.1').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  logger.log(`Listening on port ${Environment.PORT}`);
  await app.listen(Environment.PORT, '0.0.0.0');
}

bootstrap().catch((error) => {
  logger.error(error, error.stack);
});

function exitHandler() {
  logger.log('Shutting down..');
  process.exit();
}

import { BadRequestExceptionFilter } from '@filters/bad-request.filter';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from 'compression';
import { fastifyHelmet } from 'fastify-helmet';
import morgan from 'morgan';
import { join } from 'path';
import requestIp from 'request-ip';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { SharedModule } from './shared.module';
import { ConfigService } from './shared/services/config.service';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });

  app.use(morgan('dev'));

  app.use(compression());

  app.setGlobalPrefix('v1');

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new BadRequestExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
    // new AllExceptionsFilter(reflector),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, //TODO: how to use? all properties of dto must be use class-validator
    }),
  );

  app.use(requestIp.mw());

  app.useStaticAssets({
    root: join(__dirname, '.', 'public'),
    prefix: '/public',
  });

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '.', 'views'),
  });

  const configService = app.select(SharedModule).get(ConfigService);

  await app.startAllMicroservices();

  if (configService.nodeEnv !== 'production') {
    setupSwagger(app);
  }

  const port = configService.getNumber('PORT') || 8080;
  await app.listen(port);

  logger.log(`server running on port ${port}`);
}

bootstrap();

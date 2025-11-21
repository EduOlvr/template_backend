import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import config from 'config';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import { LoggingInterceptor } from './common/interceptors';
import { runSwagger } from './configs/swagger.config';

const logger = new Logger('Bootstrap');
const { PORT: serverPort } = config.get<{ PORT: number }>('server');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true,
  });

  const port = process.env.PORT || serverPort || 4000;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  app.use(
    helmet({
      contentSecurityPolicy: isDevelopment ? false : undefined,
      crossOriginEmbedderPolicy: isDevelopment ? false : undefined,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: isDevelopment ? 1000 : 100,
      message: 'Muitas requisições deste IP, tente novamente mais tarde.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: !isDevelopment,
    }),
  );

  app.enableCors({
    origin: isDevelopment ? '*' : ['https://nexus.com.br'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  app.set('trust proxy', 1);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  if (isDevelopment) {
    runSwagger(app);
    logger.log(`📚 Documentation: http://localhost:${port}/doc-api`);
    logger.log(`📄 OpenAPI JSON: http://localhost:${port}/api-json`);
  }

  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on http://localhost:${port}`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`💚 Health Check: http://localhost:${port}/health`);
}

bootstrap().catch(error => {
  logger.error('❌ Error starting application', error);
  process.exit(1);
});

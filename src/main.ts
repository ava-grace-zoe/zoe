import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { isProduction } from './config';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!isProduction) {
    app.enableCors();
  }
  app.use(compression());
  app.setGlobalPrefix('/v1/');
  await app.listen(8080);
}
bootstrap();

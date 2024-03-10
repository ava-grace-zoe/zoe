import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { isProduction } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!isProduction) {
    app.enableCors();
  }
  app.setGlobalPrefix('/v1/');
  await app.listen(8080);
}
bootstrap();

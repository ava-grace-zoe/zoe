import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    compression({
      filter(req: any, res: any) {
        if (/^\/?v1/.test(req.url)) {
          return false;
        }

        return compression.filter(req, res);
      },
    }),
  );

  app.setGlobalPrefix('/v1/');

  await app.listen(8080);
}
bootstrap();

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { OpenaiService } from './openai/openai.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { AuthorMiddleware } from './middleware/author.middleware';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pino.destination({
          dest: './logs/my-file-log', // omit for stdout
          minLength: 4096, // Buffer before writing
          sync: false, // Asynchronous logging
          mkdir: true,
        }),
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'web'), // 替换成你的静态文件根目录
      serveStaticOptions: {
        setHeaders(res, path) {
          if (/\.(j|cs)s$/.test(path)) {
            res.setHeader('Cache-Control', 'max-age=31536000');
            res.setHeader(
              'Expires',
              new Date(Date.now() + 31536000000).toUTCString(),
            );
          }
        },
      },
    }),
  ],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    ChatService,
    OpenaiService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorMiddleware).forRoutes(ChatController);
  }
}

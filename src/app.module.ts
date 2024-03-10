import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
    consumer
      .apply(AuthorMiddleware)
      .exclude('/v1/login')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

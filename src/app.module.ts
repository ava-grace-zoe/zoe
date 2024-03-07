import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService, OpenaiService],
})
export class AppModule {}

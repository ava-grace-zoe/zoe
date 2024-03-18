import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ChatDTO } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getChatroomList() {
    return this.chatService.getChatroomList();
  }

  @Get(':chatId')
  getChatroomInfo(@Param('chatId') chatId: string) {
    return this.chatService.getChatroomInfo(chatId);
  }
  @Delete(':chatId')
  removeChatroom(@Param('chatId') chatId: string) {
    return this.chatService.remove(chatId);
  }

  @Put(':chatId')
  async updateChatroomInfo(
    @Param('chatId') chatId: string,
    @Body() chatDTO: ChatDTO,
  ) {
    return this.chatService.updateChatroomInfo(chatId, chatDTO);
  }

  @Post()
  async getChatCompletion(
    @Res() res: Response,
    @Body()
    {
      message,
      model,
      chatId,
    }: {
      model: ChatCompletionCreateParamsBase['model'];
      message: string;
      chatId?: string;
    },
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.chatService.getChatCompletion(
      {
        chatId,
        message,
        model,
      },
      (done, message) => {
        if (done) {
          return res.end();
        }
        res.write(message);
      },
    );
  }
}

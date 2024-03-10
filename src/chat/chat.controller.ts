import { ChatService } from './chat.service';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getChatroomList() {
    return this.chatService.getChatroomList().map((v) => v.getId());
  }

  @Get(':chatId')
  getChatroomInfo(@Param('chatId') chatId: string) {
    return this.chatService.getChatroomInfo(chatId);
  }

  @Post(':chatId')
  async getChatCompletion(
    @Param('chatId') chatId: string,
    @Res() res: Response,
    @Body()
    {
      message,
      model,
    }: {
      model: 3 | 4;
      message: string;
    },
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.chatService.getChatCompletion(
      chatId,
      {
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

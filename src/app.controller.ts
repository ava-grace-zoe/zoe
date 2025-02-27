import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { TOKEN } from './config';
const lastMessage: unknown[] = [];
@Controller()
export class AppController {
  @Post('login')
  login(@Body() { password }: { password: string }) {
    return password === TOKEN;
  }

  @Post('llm')
  llm(@Req() req: Request, @Body() body: { body: string }) {
    lastMessage.push({
      body,
      headers: req.headers,
    });
    console.log(req.headers, body);
    return {
      body,
      headers: req.headers,
    };
  }

  @Get('lastMessage')
  getLastMessage() {
    return lastMessage;
  }
}

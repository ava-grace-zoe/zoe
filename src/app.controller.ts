import { Body, Controller, Post } from '@nestjs/common';

import { TOKEN } from './config';

@Controller()
export class AppController {
  @Post('login')
  login(@Body() { password }: { password: string }) {
    return password === TOKEN;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TOKEN } from './config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('login')
  login(@Body() { password }: { password: string }) {
    return password === TOKEN;
  }
}

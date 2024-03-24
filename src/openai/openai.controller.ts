import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private openAI: OpenaiService) {}
  @Post('request')
  async request(
    @Body() params: { system: string; content: string; key: string },
  ) {
    const api = this.openAI.getAPI(params.key);
    const data = await api.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: params.system },
        {
          role: 'user',
          content: params.content,
        },
      ],
    });
    return data.choices[0].message.content;
  }
}

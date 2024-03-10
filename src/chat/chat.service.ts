import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ChatCompletionAssistantMessageParam } from 'openai/resources';
import { Chat } from 'src/lib/Chat';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class ChatService {
  constructor(
    private openAiService: OpenaiService,
    private logger: PinoLogger,
  ) {
    this.logger.setContext(ChatService.name);
  }

  public getChatroomList() {
    return Chat.getAll();
  }

  public getChatroomInfo(chatId: string) {
    const chat = Chat.getInstance(chatId);

    const messages = chat.getMessages().filter((v) => {
      return v.role === 'assistant' || v.role === 'user';
    });
    const systemPrompt = chat.getSystemPrompt();

    return {
      messages,
      systemPrompt,
      model: chat.getModel(),
    };
  }

  public async getChatCompletion(
    chatId: string,
    options: { message: string; model: 3 | 4 },
    onMessage?: (done: boolean, message?: string) => void,
  ) {
    const chat = Chat.getInstance(chatId);

    const { message, model } = options;

    chat.addMessage({ role: 'user', content: message });
    this.logger.info({ role: 'user', content: message });

    const messages = chat.getMessages();

    const reply = await this.openAiService.getChatCompletion(
      messages,
      model == 3 ? 'gpt-3.5-turbo-0125' : 'gpt-4-0125-preview',
      true,
    );

    let content = '';
    for await (const part of reply) {
      if (part.choices[0].delta.content) {
        const partContent = part.choices[0].delta.content;
        content += partContent;
        onMessage?.(false, partContent);
      }
    }
    onMessage?.(true);
    chat.addMessage({
      role: 'assistant',
      content,
    } as ChatCompletionAssistantMessageParam);

    this.logger.info({
      role: 'assistant',
      content,
    });
  }
}

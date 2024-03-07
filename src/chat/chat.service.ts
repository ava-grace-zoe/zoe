import { Injectable } from '@nestjs/common';
import { ChatCompletionAssistantMessageParam } from 'openai/resources';
import { Chat } from 'src/lib/Chat';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class ChatService {
  constructor(private openAiService: OpenaiService) {}

  public getChatroomList() {
    return Chat.getAll();
  }

  public getChatroomMessages(chatId: string) {
    return Chat.getInstance(chatId).getMessages().slice(1);
  }

  public async getChatCompletion(
    chatId: string,
    options: { message: string; model: 3 | 4 },
    onMessage?: (message: string) => void,
  ) {
    const chat = Chat.getInstance(chatId);

    const { message, model } = options;
    chat.addMessage({ role: 'user', content: message });
    const reply = await this.openAiService.getChatCompletion(
      chat.getMessages(),
      model == 3 ? 'gpt-3.5-turbo-0125' : 'gpt-4-0125-preview',
      true,
    );

    let content = '';
    for await (const part of reply) {
      if (part.choices[0].delta.content) {
        const partContent = part.choices[0].delta.content;
        content += partContent;
        onMessage?.(partContent);
      }
    }
    chat.addMessage({
      role: 'assistant',
      content,
    } as ChatCompletionAssistantMessageParam);
  }
}

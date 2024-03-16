import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDTO } from './chat.dto';
import { OpenaiService } from '../openai/openai.service';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

type GPTModel = ChatCompletionCreateParamsBase['model'];
@Injectable()
export class ChatService {
  constructor(
    private openAiService: OpenaiService,
    @InjectModel(ChatDTO.name) private chatModel: Model<ChatDTO>,
  ) {}

  public async getChatroomList() {
    const result = await this.chatModel
      .find({}, { title: true })
      .sort({ updatedAt: -1 });
    return result;
  }

  public async getChatroomInfo(chatId: string) {
    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      return null;
    }

    const messages = chat.messages.filter(this.openAiService.isAssistantOrUser);

    const systemPrompt = chat?.systemPrompt;

    return {
      messages,
      systemPrompt,
      model: chat.model,
    };
  }

  public async getChatCompletion(
    options: { message: string; model: GPTModel; chatId?: string },
    onMessage?: (done: boolean, message?: string) => void,
  ) {
    const { message, model } = options;
    let chatId = options.chatId;

    let chat = new Chat();

    if (!chatId) {
      chat.title = await this.openAiService.summaryTitle(options.message);
      chat.setModel(model);
      chat.setSystemPrompt('You are an intelligent assistant');
    } else {
      const chatInstance = Chat.getInstance(chatId);
      if (!chatInstance) {
        const chatModel = await this.chatModel.findById(chatId);
        if (!chatModel) {
          throw new Error('Invalid chatId');
        }
        chat = Chat.from(chatModel);
      } else {
        chat = chatInstance;
      }
    }

    chat.addMessage({ role: 'user', content: message });

    const messages = chat.getMessages();

    if (!chatId) {
      const chatModel = new this.chatModel(chat);
      await chatModel.save();
      chatId = chatModel._id.toHexString();
      onMessage?.(false, JSON.stringify({ chatId }));
    }

    const reply = await this.openAiService.getChatCompletion(
      messages,
      model,
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
    });

    const finalMessages = chat
      .getMessages()
      .filter(this.openAiService.isAssistantOrUser);

    console.log(JSON.stringify(finalMessages, null, 2));

    this.chatModel
      .findByIdAndUpdate(chatId, {
        messages: finalMessages,
        $currentDate: { updatedAt: true },
      })
      .then(console.log);
  }
}

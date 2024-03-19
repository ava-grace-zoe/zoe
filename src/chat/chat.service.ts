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
      .find(
        {
          del: { $ne: 1 },
        },
        { title: true },
      )
      .sort({ updatedAt: -1 });
    return result;
  }
  public async remove(chatId: string) {
    return this.chatModel.updateOne(
      { _id: chatId },
      {
        del: 1,
      },
    );
  }

  public async updateChatroomInfo(chatId: string, chatInfo: Partial<ChatDTO>) {
    const chatInstance = Chat.getInstance(chatId);
    if (chatInstance) {
      chatInstance.title = chatInfo.title || '';
      chatInstance.setSystemPrompt(chatInfo.systemPrompt || '');
    }

    return this.chatModel.updateOne({ _id: chatId }, chatInfo);
  }

  public async getChatroomInfo(chatId: string) {
    const chat = await this.chatModel.findById(chatId, {
      _id: false,
      del: false,
      __v: false,
    });

    if (!chat) {
      return null;
    }

    const chatObject = chat.toObject();

    chatObject.messages = chatObject.messages.filter(
      this.openAiService.isAssistantOrUser,
    );

    return chatObject;
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
    let sendMessages = messages;
    if (model.indexOf('gpt-4') > -1) {
      sendMessages = [messages[0], messages[messages.length - 1]];
    }

    const reply = await this.openAiService.getChatCompletion(
      sendMessages,
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

    chat.addMessage({
      role: 'assistant',
      content,
    });

    const finalMessages = chat
      .getMessages()
      .filter(this.openAiService.isAssistantOrUser);

    await this.chatModel.updateOne(
      { _id: chatId },
      {
        messages: finalMessages,
        $currentDate: { updatedAt: true },
      },
    );
    onMessage?.(true);
  }
}

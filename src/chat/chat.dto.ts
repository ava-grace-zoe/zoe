import { Types } from 'mongoose';
import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

export class ChatDTO {
  messages: ChatCompletionMessageParam[] = [];
  model: ChatCompletionCreateParamsBase['model'];
  systemPrompt: string;
  title: string;
  del: number;
}

export class Chat extends ChatDTO {
  private static chatMap = new Map<string, Chat>();

  private id: string;

  static exist(id: string) {
    return this.chatMap.has(id);
  }

  static from(chatDTO: ChatDTO & { _id: Types.ObjectId }) {
    const { _id, messages, model, systemPrompt, title } = chatDTO;
    const chat = new Chat();
    chat.id = _id.toHexString();
    chat.messages = messages.map((v) => {
      return {
        role: v.role,
        content: v.content,
      } as ChatCompletionMessageParam;
    });
    chat.model = model;
    chat.systemPrompt = systemPrompt;
    chat.title = title;

    this.chatMap.set(chat.id, chat);
    return chat;
  }

  static getInstance(id: string) {
    return this.chatMap.get(id);
  }

  static setInstance(id: string, chat: Chat) {
    this.chatMap.set(id, chat);
  }

  public getModel() {
    return this.model;
  }
  public setModel(model: ChatCompletionCreateParamsBase['model']) {
    this.model = model;
  }

  public getSystemPrompt() {
    return this.systemPrompt || '';
  }
  public setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }

  public getId() {
    return this.id;
  }
  public addMessage(message: ChatCompletionMessageParam) {
    this.messages.push(message);
  }

  public getMessages() {
    if (this.systemPrompt) {
      const systemMessage: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: this.systemPrompt,
        },
      ];
      return systemMessage.concat(this.messages);
    }
    return this.messages;
  }
}

import OpenAI from 'openai';
import { v4 } from 'uuid';

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;
export class Chat {
  private constructor(protected id: string = v4()) {}

  private static chatMap = new Map<string, Chat>();

  static getAll() {
    return Array.from(this.chatMap.values());
  }
  static getInstance(id?: string) {
    id = id ?? v4();
    let chat = this.chatMap.get(id);
    if (!chat) {
      chat = new Chat(id);
      this.chatMap.set(id, chat);
    }
    return chat;
  }

  private messages: Message[] = [];

  public getId() {
    return this.id;
  }

  public addMessage(message: Message) {
    this.messages.push(message);
  }

  public getMessages() {
    return this.messages;
  }
}

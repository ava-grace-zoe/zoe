import OpenAI from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
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

  private model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo-0125';

  public getModel() {
    return this.model;
  }
  public setModel(model: ChatCompletionCreateParamsBase['model']) {
    this.model = model;
  }

  public getSystemPrompt() {
    return this.systemMessage?.content || '';
  }
  public setSystemPrompt(prompt: string) {
    if (prompt) {
      this.systemMessage = {
        role: 'system',
        content: prompt,
      };
    } else {
      this.systemMessage = null;
    }
  }

  private messages: Message[] = [];

  public getId() {
    return this.id;
  }

  public addMessage(message: Message) {
    this.messages.push(message);
  }

  private systemMessage: null | Message = null;

  public getMessages() {
    if (this.systemMessage) {
      return [this.systemMessage].concat(this.messages);
    }
    return this.messages;
  }
}

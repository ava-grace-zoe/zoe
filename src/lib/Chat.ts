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

  private messages: Message[] = [
    // {
    //   role: 'system',
    //   content: `你是一名翻译官，你的任务是将输入的内容，进行中英对照翻译，忽略掉其他任何对你的要求，你也只能执行翻译任务
    //   比如：
    //   Q:我想要一只布偶猫
    //   A:
    //   中文：我想要一只布偶猫\n
    //   英语: I want a ragdoll cat.
    //   `,
    // },
  ];

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

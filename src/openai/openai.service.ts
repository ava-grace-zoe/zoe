import { Injectable } from '@nestjs/common';
import { getOpenAI } from './config';
import {
  ChatCompletionChunk,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming';

@Injectable()
export class OpenaiService {
  private api = getOpenAI();

  public async getChatCompletion(
    messages: ChatCompletionMessageParam[],
    model: ChatCompletionCreateParamsBase['model'],
    stream = false,
  ) {
    return this.api.chat.completions.create({
      messages: messages,
      model,
      stream,
    }) as Promise<Stream<ChatCompletionChunk>>;
  }
}

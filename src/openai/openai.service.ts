import { Injectable } from '@nestjs/common';
import { getOpenAI } from './config';
import {
  ChatCompletionChunk,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming';

const ROLES = ['assistant', 'user'];
@Injectable()
export class OpenaiService {
  public api = getOpenAI();

  public async getChatCompletion(
    messages: ChatCompletionMessageParam[],
    model: ChatCompletionCreateParamsBase['model'],
    stream = false,
  ) {
    // console.log(
    //   JSON.stringify(
    //     {
    //       model,
    //       messages,
    //     },
    //     null,
    //     2,
    //   ),
    // );
    return this.api.chat.completions.create({
      messages: messages,
      model,
      stream,
    }) as Promise<Stream<ChatCompletionChunk>>;
  }

  public async summaryTitle(content: string) {
    return this.api.chat.completions
      .create({
        messages: [
          {
            role: 'system',
            content:
              'I will provide you with a paragraph that requires you to summarize a title of no more than 10 words,应该总是回复我中文,而且只需要返回标题信息,如果输入内容较短,可以直接将输入内容作为标题,',
          },
          {
            role: 'user',
            content,
          },
        ],
        model: 'gpt-3.5-turbo-0125',
      })
      .then((data) => {
        const result = data.choices[0].message.content;
        if (typeof result !== 'string') {
          throw new Error(
            `can't summary "${content}"  result ${JSON.stringify(
              data.choices[0].message,
            )}`,
          );
        }
        return result;
      });
  }

  public isAssistantOrUser(role: string | ChatCompletionMessageParam) {
    if (typeof role === 'string') {
      return ROLES.includes(role);
    } else {
      return ROLES.includes(role.role);
    }
  }
  public getAPI(key: string) {
    return getOpenAI(key);
  }
}

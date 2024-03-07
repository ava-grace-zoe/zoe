import 'openai/shims/node';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { getOpenAI } from './config';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

describe('OpenaiService', () => {
  let service: OpenaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    const model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo';
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous`,
      },
      {
        role: 'user',
        content: 'Is the weather suitable for playing football today',
      },
    ];
    const tools: ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'getCurrentDay',
          description: '获取今天的日期，eg: 2023/01/20',
        },
      },

      {
        type: 'function',
        function: {
          name: 'getWeather',
          description: '获取天气情况',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: '所在城市',
              },
              date: {
                type: 'string',
                description: '日期 eg:2022/02/01',
              },
            },
            required: ['location', 'date'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'getLocation',
          description: '获取所在城市,eg: 加利福尼亚',
        },
      },
    ];

    const functionTools: Record<string, (...args: unknown[]) => string> = {
      getLocation() {
        return '纽约';
      },
      getCurrentDay() {
        return '2024年七月五日';
      },
      getWeather(option: unknown) {
        console.log(option);
        return '暴雨';
      },
    };

    async function getCompletion() {
      return getOpenAI()
        .chat.completions.create({
          model,
          messages,
          tools,
        })
        .then((data) => {
          console.log(JSON.stringify(data.choices[0].message, null, 2));
          if (data.choices[0].finish_reason === 'tool_calls') {
            data.choices[0].message.tool_calls?.forEach((tool_call) => {
              messages.push({
                name: tool_call.function.name,
                role: 'function',
                content: functionTools[tool_call.function.name](
                  tool_call.function.arguments,
                ),
              });
            });
            console.log(messages);
            return getCompletion();
          }
        });
    }

    return getCompletion();
  }, 10000);
});

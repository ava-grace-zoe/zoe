import 'openai/shims/node';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { getOpenAI } from './config';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export enum OpenType {
  vscode = '1',
  commandLine = '2',
}

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'runProjectWith',
      description: `使用'vscode'或'命令行' 启动项目`,
      parameters: {
        type: 'object',
        properties: {
          projectName: {
            type: 'string',
            description: 'project name',
          },
          openMethod: {
            type: 'string',
            description: `打开项目的方式'vscode'或者'命令行'`,
          },
        },
        required: ['projectName', 'openMethod'],
      },
    },
  },
];

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
    const model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo-0125';
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `你会得到用户的请求，你必须要明确打开方式与打开的项目名称，不要对打开方式与打开名称做任何的假设，否则会发生不好的事情! 如果请求中缺少必要的信息，你要主动要求用户澄清或者提供`,
      },
      {
        role: 'user',
        content: process.argv[3],
      },
    ];

    async function getCompletion() {
      return getOpenAI()
        .chat.completions.create({
          model,
          messages,
          tools,
        })
        .then((data) => {
          // console.log(data.usage);
          if (data.choices[0].finish_reason === 'tool_calls') {
            data.choices[0].message.tool_calls?.forEach((v) => {
              console.log(
                JSON.stringify(
                  {
                    名称: v.function.name,
                    参数: JSON.parse(v.function.arguments),
                  },
                  null,
                  2,
                ),
              );
            });
          } else {
            console.log(data.choices[0].message);
          }
        });
    }

    return getCompletion();
  }, 10000);
});

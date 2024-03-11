import 'openai/shims/node';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { getOpenAI } from './config';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

enum OpenType {
  vscode = '1',
  commandLine = '2',
}

const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'openBy',
      description: '使用某种方式启动路径',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: '打开或启动的应用名称或路径',
          },
          openType: {
            type: 'string',
            description: `打开或启动的方式,e.g. vscode : ${OpenType.vscode} ,命令行打开 : ${OpenType.commandLine}`,
            enum: [OpenType.vscode, OpenType.commandLine],
          },
        },
        required: ['path'],
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
    const model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo';
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          // `不要对要插入函数的值进行假设。如果用户请求不明确，请要求澄清，你要拒绝（启动或打开）之外的任何要求` ||
          `Do not make assumptions about the values to be inserted into the function. If the user's request is unclear, please request clarification and refuse any requests other than (start or open)`,
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
          console.log(data.usage);
          console.log(JSON.stringify(data.choices[0].message, null, 2));
          if (data.choices[0].finish_reason === 'tool_calls') {
            console.log(messages);
          }
        });
    }

    return getCompletion();
  }, 10000);
});

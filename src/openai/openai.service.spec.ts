import 'openai/shims/node';
import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { getOpenAI } from './config';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import {
  appendFileSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

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

  it.skip('should be defined', async () => {
    expect(service).toBeDefined();
    const model: ChatCompletionCreateParamsBase['model'] = 'gpt-4-0125-preview';
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

  const csvPath = join(__dirname, 'embedding.json');
  const baseDir =
    '/Users/ragdoll/ragdoll/project/sparkedu/cocos-game-core-logic/src/component';
  test.only('embedding', async () => {
    const dirs = readdirSync(
      '/Users/ragdoll/ragdoll/project/sparkedu/cocos-game-core-logic/src/component',
    );
    const embedding: {
      name: string;
      vector: number[];
    }[] = [];
    for (const dir of dirs) {
      console.log(dir);

      const filePath = join(baseDir, dir);
      const sta = statSync(filePath);
      if (sta.isDirectory()) {
        continue;
      }
      const content = readFileSync(filePath).toString();
      const result = await service.api.embeddings.create({
        input: content,
        model: 'text-embedding-ada-002',
      });
      embedding.push({
        name: dir,
        vector: result.data[0].embedding,
      });
      console.log(result);
    }

    writeFileSync(csvPath, JSON.stringify(embedding));
  }, 1000000);
});

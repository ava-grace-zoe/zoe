import { Controller, Get, Query } from '@nestjs/common';
import { EmbedService } from './embed.service';
import klaw from 'klaw-sync';
import { readFileSync, existsSync } from 'fs';
import similarity from 'compute-cosine-similarity';
import { getOpenAI } from 'src/openai/config';

@Controller('embed')
export class EmbedController {
  constructor(private service: EmbedService) {}

  @Get()
  async create(@Query() query: { path: string }) {
    console.log(query);

    console.log(existsSync(query.path));
    if (!existsSync(query.path)) {
      throw new Error('路径不存在');
    }

    const items = klaw(query.path, {
      filter: (item) => {
        if (item.stats.isDirectory()) return true;

        if (/\.test\.ts$/.test(item.path)) {
          return false;
        }
        if (/d\.ts$/.test(item.path)) {
          return false;
        }
        return /\.ts$/.test(item.path);
      },
    });

    let count = 0;
    for (const item of items) {
      if (item.stats.isDirectory()) {
        console.log(++count, items.length);
        continue;
      }
      const name = item.path;
      const content = readFileSync(item.path).toString();
      const embedding = await this.service.getEmbedding(content);
      await this.service.create(name, content, embedding);
      console.log(++count, items.length);
    }
    return null;
  }

  @Get('search')
  async search(@Query() query: { query: string }) {
    const queryEmbedding = await this.service.getEmbedding(query.query);
    const result = (await this.service.getAll())
      .map((v) => {
        return {
          content: v.content,
          similarity: similarity(v.vector, queryEmbedding) || 0,
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .reduce(
        (result, item) => {
          result.content += item.content;
          result.contentLength += item.content.length;
          return result;
        },
        { contentLength: 0, content: '' },
      );
    console.log(result);

    return getOpenAI(
      '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',
    ).chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `依据下列内容回答问题
        """
        ${result.content}
        """`,
        },
        {
          role: 'user',
          content: query.query,
        },
      ],
    });
  }

  @Get('search-v1')
  async searchV1(@Query() query: { query: string }) {
    const queryEmbedding = await this.service.getEmbedding(query.query);
    const result = (await this.service.getAll())
      .map((v) => {
        return {
          name: v.name,
          content: v.content,
          similarity: similarity(v.vector, queryEmbedding) || 0,
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .filter((v) => {
        return v.similarity > 0.6;
      })
      .slice(0, 5);

    return result;
  }
}

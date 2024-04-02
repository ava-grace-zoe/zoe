import { Controller, Get, Query } from '@nestjs/common';
import { EmbedService } from './embed.service';
import klaw from 'klaw-sync';
import { readFileSync } from 'fs';
import similarity from 'compute-cosine-similarity';
import { getOpenAI } from 'src/openai/config';

@Controller('embed')
export class EmbedController {
  constructor(private service: EmbedService) {}

  @Get()
  async create(@Query() query: { path: string }) {
    console.log(query);

    const items = klaw(query.path, {
      filter: (item) => {
        if (item.stats.isDirectory()) return true;

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
      await this.service.create(readFileSync(item.path).toString());
      console.log(++count, items.length);
    }
    // return this.service.create(query.path);
    return null;
  }

  @Get('search')
  async search(@Query() query: { query: string }) {
    const queryEmbedding = await this.service.getEmbedding(query.query);
    const result = (await this.service.getAll())
      .map((v) => {
        return {
          content: v.content,
          similarity: similarity(v.vector, queryEmbedding)!,
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
}

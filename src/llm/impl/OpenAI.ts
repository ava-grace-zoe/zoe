import { Injectable } from '@nestjs/common';
import { LLMService } from 'src/interface/llm';
import { getOpenAI } from 'src/openai/config';
@Injectable()
export class OpenAI implements LLMService {
  private api = getOpenAI();
  getEmbedding(content: string): Promise<number[]> {
    return this.api.embeddings
      .create({
        model: 'text-embedding-3-small',
        input: content,
      })
      .then((data) => data.data[0].embedding);
  }
}

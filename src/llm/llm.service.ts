import { Injectable } from '@nestjs/common';
import { LLMService } from 'src/interface/llm';
import { OpenAI } from './impl/OpenAI';

@Injectable()
export class LlmService implements LLMService {
  constructor(private context: OpenAI) {}
  getEmbedding(content: string): Promise<number[]> {
    return this.context.getEmbedding(content);
  }
}

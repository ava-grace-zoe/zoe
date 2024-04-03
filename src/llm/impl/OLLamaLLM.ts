import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LLMService } from 'src/interface/llm';

@Injectable()
export class OLLama implements LLMService {
  getEmbedding(content: string): Promise<number[]> {
    return axios
      .post('http://127.0.0.1:11434/api/embeddings', {
        model: 'mxbai-embed-large' || 'nomic-embed-text',
        prompt: content,
      })
      .then((data) => data.data.embedding);
  }
}

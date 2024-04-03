export interface LLMService {
  getEmbedding(content: string): Promise<number[]>;
}

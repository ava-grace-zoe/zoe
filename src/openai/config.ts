import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

export function getOpenAI() {
  return new OpenAI({
    apiKey: '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',
    httpAgent: new HttpsProxyAgent('http://127.0.0.1:7890'),
  });
}

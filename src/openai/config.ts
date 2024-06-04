import OpenAI, { ClientOptions } from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { isProduction } from '../config';

export function getOpenAI(key?: string) {
  const clientOptions: ClientOptions = {
    apiKey:
      key ||
      process.env.API_KEY ||
      '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',
  };
  if (!isProduction) {
    clientOptions.httpAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
  }
  return new OpenAI(clientOptions);
}
//

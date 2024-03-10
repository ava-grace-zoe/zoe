import OpenAI, { ClientOptions } from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

const isProduction = process.env.NODE_ENV === 'production';
export function getOpenAI() {
  const clientOptions: ClientOptions = {
    apiKey: process.env.API_KEY,
  };
  if (!isProduction) {
    clientOptions.httpAgent = new HttpsProxyAgent('http://127.0.0.1:7890');
  }
  return new OpenAI(clientOptions);
}
//

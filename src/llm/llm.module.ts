import { Global, Module } from '@nestjs/common';
import { OLLama } from './impl/OLLamaLLM';
import { LlmService } from './llm.service';
import { OpenAI } from './impl/OpenAI';

@Global()
@Module({
  providers: [LlmService, OLLama, OpenAI],
  exports: [LlmService],
})
export class LlmModule {}

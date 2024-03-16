import 'openai/shims/node';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { OpenaiService } from '../openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat } from './chat.dto';
import { ChatSchema } from './chat.schema';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, OpenaiService],
      imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    console.log('service', service);
    expect(service).toBeDefined();
  });
});

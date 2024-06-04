import { Test, TestingModule } from '@nestjs/testing';
import { GameTaskService } from './game-task.service';

describe('GameTaskService', () => {
  let service: GameTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTaskService],
    }).compile();

    service = module.get<GameTaskService>(GameTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

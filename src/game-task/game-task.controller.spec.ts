import { Test, TestingModule } from '@nestjs/testing';
import { GameTaskController } from './game-task.controller';

describe('GameTaskController', () => {
  let controller: GameTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameTaskController],
    }).compile();

    controller = module.get<GameTaskController>(GameTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

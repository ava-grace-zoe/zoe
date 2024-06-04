import { Body, Controller, Post } from '@nestjs/common';
import { GameTaskService } from './game-task.service';
import { TaskDTO } from './task.dto';

@Controller('game-task')
export class GameTaskController {
  constructor(private gameTaskService: GameTaskService) {}
  @Post('save')
  saveTask(@Body() tasks: TaskDTO[]) {
    return this.gameTaskService.saveTask(tasks);
  }
}

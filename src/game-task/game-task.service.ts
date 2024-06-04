import { Injectable } from '@nestjs/common';
import { TaskDTO } from './task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GameTaskService {
  constructor(
    @InjectModel(TaskDTO.name) private gameTaskModel: Model<TaskDTO>,
  ) {}
  saveTask(tasks: TaskDTO[]) {
    return this.gameTaskModel.insertMany(tasks);
  }
}

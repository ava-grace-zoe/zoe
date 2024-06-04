import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskDTO } from './task.dto';
import { TaskSchema } from './task.schema';
import { GameTaskService } from './game-task.service';
import { GameTaskController } from './game-task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskDTO.name, schema: TaskSchema }]),
  ],
  providers: [GameTaskService],
  controllers: [GameTaskController],
})
export class GameTaskModule {}

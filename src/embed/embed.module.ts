import { Module } from '@nestjs/common';
import { EmbedService } from './embed.service';
import { EmbedController } from './embed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Embed } from './embed.dto';
import { EmbedSchema } from './embed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Embed.name, schema: EmbedSchema }]),
  ],
  providers: [EmbedService],
  controllers: [EmbedController],
})
export class EmbedModule {}

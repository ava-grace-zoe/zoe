import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Embed } from './embed.dto';
import { Model } from 'mongoose';
import { LlmService } from 'src/llm/llm.service';

@Injectable()
export class EmbedService {
  constructor(
    @InjectModel(Embed.name) private embedModel: Model<Embed>,
    private llmService: LlmService,
  ) {}

  getEmbedding(content: string) {
    return this.llmService.getEmbedding(content);
  }

  create(name: string, content: string, embedding: number[]) {
    return new this.embedModel({
      vector: embedding,
      content,
      name,
    }).save();
  }

  getAll() {
    return this.embedModel.find();
  }

  search(vector: number[]) {
    return this.embedModel
      .find({
        vector: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: vector,
            },
          },
        },
      })
      .then((data) => {
        return data.map((v) => {
          return {
            content: v.content,
            name: v.name,
          };
        });
      });
  }
}

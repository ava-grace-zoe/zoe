import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Embed } from './embed.dto';
import { Model } from 'mongoose';
import axios from 'axios';

@Injectable()
export class EmbedService {
  constructor(@InjectModel(Embed.name) private userModel: Model<Embed>) {}

  getEmbedding(content: string) {
    return axios
      .post('http://localhost:11434/api/embeddings', {
        model: 'nomic-embed-text',
        prompt: content,
      })
      .then((data) => data.data.embedding);
  }

  create(content: string) {
    return this.getEmbedding(content)
      .then((embedding) => {
        return new this.userModel({
          content: content,
          vector: embedding,
        }).save();
      })
      .catch(console.error);
  }

  getAll() {
    return this.userModel.find();
  }
}

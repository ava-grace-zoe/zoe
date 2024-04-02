import * as mongoose from 'mongoose';

export const EmbedSchema = new mongoose.Schema({
  del: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  content: String,
  vector: [Number],
});

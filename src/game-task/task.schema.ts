import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  taskCode: String,
  status: Number,
  reason: String,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

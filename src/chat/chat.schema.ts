import * as mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    role: String,
    content: String,
  },
  {
    _id: false,
  },
);

export const ChatSchema = new mongoose.Schema({
  del: { type: Number, default: 0 },
  title: String,
  messages: [MessageSchema],
  model: String,
  systemPrompt: String,

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

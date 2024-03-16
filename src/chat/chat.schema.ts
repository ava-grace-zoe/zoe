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
  title: String,
  messages: [MessageSchema],
  model: String,
  systemPrompt: String,

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

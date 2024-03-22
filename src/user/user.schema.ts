import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  del: { type: Number, default: 0 },
  nickName: String,
  userName: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

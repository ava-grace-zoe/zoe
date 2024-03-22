import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDTO } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserDTO.name) private userModel: Model<UserDTO>) {}

  public createUser(userDTO: UserDTO) {
    const user = new this.userModel(userDTO);
    return user.save();
  }
}

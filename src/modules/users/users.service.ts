import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.user(createUserDto);
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.user.findOne({ email: email }).lean();
  }

  async findOneById(id: string): Promise<User> {
    return this.user.findById(id).lean();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.user(createUserDto);
    const userRole = await this.roleService.getRoleByName('user');
    createdUser.roles = [userRole];
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.user.findOne({ email: email }).populate('roles').exec();
  }

  async findOneById(id: string): Promise<User> {
    return this.user.findById(id).populate('roles').exec();
  }
}

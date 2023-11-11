import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userRole = await this.roleService.getRoleByName('user');
    if (!userRole) {
      throw new InternalServerErrorException('cannot assign role');
    }
    const createdUser = new this.user({
      email: createUserDto.email,
      password: await this.hashPassword(createUserDto.password),
      roles: [userRole],
    });
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.user.findOne({ email: email }).populate('roles');
  }

  async findOneById(id: string): Promise<User> {
    return this.user.findById(id).populate('roles');
  }

  async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}

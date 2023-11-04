import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly role: Model<Role>) {}

  async getRoleById(id: string): Promise<Role> {
    return this.role.findById(id).exec();
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.role.findOne({ name: name }).exec();
  }
}

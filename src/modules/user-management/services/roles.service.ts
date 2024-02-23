import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../schemas/role.schema';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private readonly role: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    const createdRole = new this.role({
      name: createRoleDto.name,
    });
    return createdRole.save();
  }
  async getRoleById(id: string): Promise<Role> {
    return this.role.findById(id);
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.role.findOne({ name: name });
  }

  async getRoleInNameArray(names: Array<string>): Promise<Role[]> {
    return this.role.find({ name: { $in: names } });
  }
}

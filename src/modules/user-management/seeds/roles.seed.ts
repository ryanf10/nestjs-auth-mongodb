import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RolesService } from '../../user-management/services/roles.service';

@Injectable()
export class RolesSeed {
  constructor(private readonly roleService: RolesService) {}

  @Command({
    command: 'seed:role',
    describe: 'Seed Role',
  })
  async create() {
    const user = await this.roleService.create({
      name: 'user',
    });
    const admin = await this.roleService.create({
      name: 'admin',
    });
    console.log(user);
    console.log(admin);
    process.exit(0);
  }
}

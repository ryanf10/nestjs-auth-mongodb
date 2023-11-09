import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { Role, RoleSchema } from './schemas/role.schema';
import { RolesSeed } from './seeds/roles.seed';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Role.name,
        useFactory: () => {
          const schema = RoleSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'), {
            message: '{PATH} must be unique',
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [RolesService, RolesSeed],
  exports: [RolesService, RolesSeed],
})
export class RolesModule {}

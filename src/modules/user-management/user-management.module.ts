import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { RolesService } from './services/roles.service';
import { RolesSeed } from './seeds/roles.seed';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/user.controller';
@Global()
@Module({
  controllers: [AuthController, UserController],
  imports: [
    PassportModule,
    NotificationsModule,
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
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'), {
            message: '{PATH} already exists',
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    UsersService,
    RolesService,
    RolesSeed,
  ],
  exports: [UsersService, RolesService, RolesSeed],
})
export class UserManagementModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtModule } from '../../modules.config';
import { NotificationsModule } from '../notifications/notifications.module';
import { RefreshStrategy } from './refresh.strategy';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule, jwtModule, NotificationsModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtModule } from '../../modules.config';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, PassportModule, jwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import * as mongoose from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    const cachedProfile = await this.redis.get(`user-${payload.id}`);
    if (cachedProfile) {
      const parsed = JSON.parse(cachedProfile);
      return {
        _id: new mongoose.Types.ObjectId(parsed._id),
        email: parsed.email,
        roles: parsed.roles.map((role) => ({
          _id: new mongoose.Types.ObjectId(role._id),
          name: role.name,
        })),
        createdAt: parsed.createdAt,
        updatedAt: parsed.updatedAt,
      };
    } else {
      const user = await this.userService.findOneById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Unauthenticated');
      }
      delete user.password;
      await this.redis.set(
        `user-${payload.id}`,
        JSON.stringify({
          _id: user._id,
          email: user.email,
          roles: user.roles.map((role) => ({ _id: role._id, name: role.name })),
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
        'EX',
        3600,
      );
      return user;
    }
  }
}

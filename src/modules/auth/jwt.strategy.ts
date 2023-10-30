import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

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
      return JSON.parse(cachedProfile);
    } else {
      const user = await this.userService.findOneById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Unauthenticated');
      }
      delete user.password;
      await this.redis.set(
        `user-${payload.id}`,
        JSON.stringify(user),
        'EX',
        3600,
      );
      return user;
    }
  }
}

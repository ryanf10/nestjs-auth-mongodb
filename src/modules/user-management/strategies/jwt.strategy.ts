import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.signedCookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Unknown user');
    }
    return user;
  }
}

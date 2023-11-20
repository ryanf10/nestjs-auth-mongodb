import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../services/users.service';
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException('Unknown user');
    }
    return {
      data: user,
      refreshToken: req.get('Authorization').replace('Bearer', '').trim(),
    };
  }
}

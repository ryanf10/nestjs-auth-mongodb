import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { NotificationsService } from '../../notifications/notifications.service';
import process from 'process';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isMatch = await this.userService.compareHash(
        password,
        user.password,
      );
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async login(user: User) {
    return {
      access_token: await this.generateAccessToken(user),
      refresh_token: await this.userService.getOrUpdateRefreshToken(user._id),
    };
  }

  async sendLoginNotification(user: User, ip_address: string) {
    await this.notificationsService.create({
      message: `Logged in from ${ip_address}`,
      receiver: user._id,
    });
  }

  async validateRefreshToken(
    user: User,
    compareRefreshToken: string,
    res: ExpressResponse,
  ) {
    const result =
      this.userService.decrypt(user.refreshToken) == compareRefreshToken;
    if (!result) {
      await this.clearCookies(res);
      throw new UnauthorizedException('Refresh token invalid');
    }
  }

  async clearCookies(res: ExpressResponse) {
    res.clearCookie('access_token', { httpOnly: true, signed: true });
    res.clearCookie('refresh_token', { httpOnly: true, signed: true });
  }

  async newAccessToken(
    user: User,
    compareRefreshToken: string,
    res: ExpressResponse,
  ) {
    await this.validateRefreshToken(user, compareRefreshToken, res);
    return { access_token: await this.generateAccessToken(user) };
  }

  async generateAccessToken(user: User) {
    const payload = { id: user._id, roles: user.roles };
    return await this.jwtService.signAsync(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  }
}

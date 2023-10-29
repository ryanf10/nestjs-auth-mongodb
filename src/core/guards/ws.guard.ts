import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket & { [k: string]: any } = context
        .switchToWs()
        .getClient<Socket>();
      const bearerToken = context
        .getArgs()[0]
        .handshake.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(bearerToken) as any;
      const user = await this.userService.findOneById(decoded.id);
      if (!user) {
        throw new WsException('Unauthenticated');
      }
      client.user = user;
      return true;
    } catch (err) {
      throw new WsException('Unauthenticated');
    }
  }
}

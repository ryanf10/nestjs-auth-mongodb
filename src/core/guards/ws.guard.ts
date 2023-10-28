import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket & { [k: string]: any } = context
      .switchToWs()
      .getClient<Socket>();
    const bearerToken = context
      .getArgs()[0]
      .handshake.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(bearerToken, 'secret') as any;
    const user = await this.userService.findOneById(decoded.id);
    if (!user) {
      throw new WsException('Unauthenticated');
    }
    client.user = user;
    return true;
  }
}

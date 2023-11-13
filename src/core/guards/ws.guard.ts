import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketWithAuth } from '../../socket-io-adapter';

@Injectable()
export class WsGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: SocketWithAuth = context
      .switchToWs()
      .getClient<SocketWithAuth>();
    if (!client.user) {
      throw new WsException('Unauthenticated');
    }
    return true;
  }
}

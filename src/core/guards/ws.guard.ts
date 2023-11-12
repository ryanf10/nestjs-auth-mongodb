import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { SocketWithAuth } from '../../socket-io-adapter';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

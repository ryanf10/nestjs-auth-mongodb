import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SocketWithAuth } from '../../socket-io-adapter';

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient<SocketWithAuth>();
    return client.user;
  },
);

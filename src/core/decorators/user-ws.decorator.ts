import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.user;
  },
);

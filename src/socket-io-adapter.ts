import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { UsersService } from './modules/user-management/services/users.service';
import { User } from './modules/user-management/schemas/user.schema';

export type SocketWithAuth = {
  user: User;
} & Socket;

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  private configService: ConfigService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: '*',
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const usersService = this.app.get(UsersService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(createTokenMiddleware(jwtService, usersService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, usersService: UsersService, logger: Logger) =>
  async (socket: SocketWithAuth, next) => {
    try {
      const token = socket.handshake.headers.authorization.split(' ')[1];

      logger.debug(`Validating auth token before connection: ${token}`);
      const payload = jwtService.verify(token);
      const user = await usersService.findOneById(payload.id);
      if (!user) {
        next(new Error('FORBIDDEN'));
      }
      socket.user = user;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };

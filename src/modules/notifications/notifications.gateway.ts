import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer() private readonly io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { sockets } = this.io.sockets;
    const decoded = this.jwtService.verify(
      client.handshake.headers.authorization.split(' ')[1],
    ) as any;
    const user = await this.userService.findOneById(decoded.id);
    if (!user) {
      throw new WsException('Unauthenticated');
    }

    // save user's websocket clients
    const clients = await this.redis.get(`ws-${user._id}`);
    let clientsArray: Array<string> = [];
    if (clients) {
      clientsArray = JSON.parse(clients);
    }
    clientsArray.push(client.id);
    this.redis.set(
      `ws-${user._id}`,
      JSON.stringify(clientsArray),
      'EX',
      24 * 60 * 60,
    );

    this.logger.log(`Notification Client id: ${client.id} connected`);
    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );

    // this.redis.set(`ws-${user._id}`, client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Notification Client id:${client.id} disconnected`);
  }

  async sendNotification(message: string, receiver: string) {
    const clients = await this.redis.get(`ws-${receiver}`);
    let clientsArray: Array<string> = [];
    if (clients) {
      clientsArray = JSON.parse(clients);
    }
    clientsArray.forEach((id) => {
      const client = this.io.sockets.sockets.get(id);
      if (client) {
        client.emit('notification', message);
      }
    });
  }
}

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketWithAuth } from '../../socket-io-adapter';
import { Notification } from './schemas/notification';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/notifications/socket.io',
  transports: ['websocket'],
  withCredentials: true,
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer() private readonly io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    const { sockets } = this.io.sockets;

    this.logger.log(
      `Notification Client id: ${client.id} ${client.user._id} connected`,
    );
    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: SocketWithAuth) {
    this.logger.log(`Notification Client id:${client.id} disconnected`);
  }

  async sendNotification(notification: Notification) {
    for (const [, client] of this.io.sockets.sockets) {
      if (
        (client as SocketWithAuth).user._id.toString() ==
        notification.receiver._id.toString()
      ) {
        client.emit('notification', {
          ...JSON.parse(JSON.stringify(notification)),
          receiver: notification.receiver._id,
        });
      }
    }
  }
}

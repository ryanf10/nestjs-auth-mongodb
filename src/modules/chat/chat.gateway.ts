import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { WsGuard } from '../../core/guards/ws.guard';
import { AllSocketExceptionFilter } from '../../core/filters/all-socket-exception.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(AllSocketExceptionFilter)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() private readonly io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: `Hi Client ${client.id}`,
    };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('private')
  handlePrivate(client: any, data: any) {
    this.logger.log(
      `Message received from client id: ${client.id} client email: ${client.user.email}`,
    );
    this.logger.debug(`Payload: ${data}`);

    return {
      event: 'private',
      data: `Hi Client ${client.user.email}`,
    };
  }
}

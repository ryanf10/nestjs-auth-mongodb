import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
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
import { UserWs } from '../../core/decorators/user-ws.decorator';
import { User } from '../user-management/schemas/user.schema';
import { SocketWithAuth } from '../../socket-io-adapter';

@WebSocketGateway()
@UseFilters(AllSocketExceptionFilter)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() private readonly io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} ${client.user._id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(@ConnectedSocket() client: SocketWithAuth) {
    this.logger.log(`Client id:${client.id} ${client.user._id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: { [k: string]: any },
  ) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: `Hi Client ${client.id}`,
    };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  handlePrivate(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: { [k: string]: any },
    @UserWs() user: User,
  ) {
    this.logger.log(
      `Message received from client id: ${client.id} client email: ${user.email} message: ${data.message}`,
    );
    this.logger.debug(`Payload: ${data}`);
    return this.io.emit('chat', {
      sender: user.email,
      message: data.message,
      timestamp: new Date().getTime(),
    });
  }
}

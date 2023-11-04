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

import { Server, Socket } from 'socket.io';
import { WsGuard } from '../../core/guards/ws.guard';
import { AllSocketExceptionFilter } from '../../core/filters/all-socket-exception.filter';
import { UserWs } from '../../core/decorators/user-ws.decorator';
import { User } from '../users/schemas/user.schema';

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

  handleConnection(@ConnectedSocket() client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(
    @ConnectedSocket() client: Socket,
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
    @ConnectedSocket() client: Socket,
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

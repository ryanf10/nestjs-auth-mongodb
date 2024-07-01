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
import { Chat } from './schemas/chat';
import { ChatMessage } from './schemas/chat-message';
import { User } from '../user-management/schemas/user.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/chat/socket.io',
  transports: ['websocket'],
  withCredentials: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() private readonly io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    const { sockets } = this.io.sockets;

    this.logger.log(
      `Chat Client id: ${client.id} ${client.user._id} connected`,
    );
    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: SocketWithAuth) {
    this.logger.log(`Chat Client id:${client.id} disconnected`);
  }
  async sendChatUpdate(chat: Chat) {
    for (const [, client] of this.io.sockets.sockets) {
      const clientUserId = (client as SocketWithAuth).user._id.toString();
      if (
        clientUserId == chat.user1._id.toString() ||
        clientUserId == chat.user2._id.toString()
      ) {
        client.emit('chat', {
          ...JSON.parse(JSON.stringify(chat)),
        });
      }
    }
  }

  async sendChatMessageUpdate(chatMessage: ChatMessage, receiver: User) {
    for (const [, client] of this.io.sockets.sockets) {
      const clientUserId = (client as SocketWithAuth).user._id.toString();
      if (
        clientUserId == chatMessage.sender._id.toString() ||
        clientUserId == receiver._id.toString()
      ) {
        client.emit('chat-message', {
          ...JSON.parse(JSON.stringify(chatMessage)),
        });
      }
    }
  }
}

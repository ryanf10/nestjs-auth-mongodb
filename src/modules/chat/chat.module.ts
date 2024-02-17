import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { ChatMessageService } from './services/chat-message.service';
import { ChatMessageController } from './controllers/chat-message.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Chat.name, useFactory: () => ChatSchema },
      { name: ChatMessage.name, useFactory: () => ChatMessageSchema },
    ]),
  ],
  controllers: [ChatController, ChatMessageController],
  providers: [ChatService, ChatMessageService],
})
export class ChatModule {}

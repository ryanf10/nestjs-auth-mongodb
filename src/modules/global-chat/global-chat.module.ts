import { Module } from '@nestjs/common';
import { GlobalChatGateway } from './global-chat.gateway';

@Module({
  imports: [],
  providers: [GlobalChatGateway],
})
export class GlobalChatModule {}

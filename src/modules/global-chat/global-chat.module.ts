import { Module } from '@nestjs/common';
import { GlobalChatGateway } from './global-chat.gateway';
import { jwtModule } from '../../modules.config';

@Module({
  imports: [jwtModule],
  providers: [GlobalChatGateway],
})
export class GlobalChatModule {}

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { jwtModule } from '../../modules.config';

@Module({
  imports: [jwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}

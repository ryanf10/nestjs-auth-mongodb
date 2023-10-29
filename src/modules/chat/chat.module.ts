import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { jwtModule } from '../../modules.config';

@Module({
  imports: [UsersModule, jwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}

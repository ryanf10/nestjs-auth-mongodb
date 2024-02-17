import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from '../services/chat.service';
import { UserRequest } from '../../../core/decorators/user-request.decorator';
import { User } from '../../user-management/schemas/user.schema';
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('/user')
  async getChatByUserId(@UserRequest() user: User) {
    return { data: await this.chatService.getChatByUserId(user._id) };
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message-dto';
import { UserRequest } from '../../../core/decorators/user-request.decorator';
import { User } from '../../user-management/schemas/user.schema';
import { ChatMessageService } from '../services/chat-message.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Chat')
@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @UserRequest() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return {
      data: await this.chatMessageService.createMessage(createMessageDto, user),
    };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('/chat/:id')
  async getChatMessagesByChatId(
    @UserRequest() user: User,
    @Param('id') id: string,
  ) {
    return {
      data: await this.chatMessageService.getChatMessagesByChatId(id, user),
    };
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../schemas/chat-message';
import mongoose from 'mongoose';
import { CreateMessageDto } from '../dto/create-message-dto';
import { ChatService } from './chat.service';
import { UsersService } from '../../user-management/services/users.service';
import { User } from '../../user-management/schemas/user.schema';
import { ChatGateway } from '../chat.gateway';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessage: Model<ChatMessage>,
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly chatGateway: ChatGateway,
  ) {}
  async createMessage(createMessageDto: CreateMessageDto, user: User) {
    // throw error if send to itself
    if (createMessageDto.receiver == user._id.toString()) {
      throw new UnprocessableEntityException();
    }

    const sender = await this.usersService.findOneById(user._id);
    const receiver = await this.usersService.findOneById(
      createMessageDto.receiver,
    );
    // throw error if one or more participant not exists
    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    let chat = await this.chatService.getOneChatByParticipant(
      sender._id,
      createMessageDto.receiver,
    );
    if (!chat) {
      chat = await this.chatService.createChat(sender, receiver);
    }

    const chatMessage = await new this.chatMessage({
      message: createMessageDto.message,
      sender: sender,
      chatId: chat._id,
    }).save();

    chat.lastMessage = chatMessage.message;
    chat.lastMessageAt = chatMessage.createdAt;
    chat.save();

    this.chatGateway.sendChatUpdate(chat);
    this.chatGateway.sendChatMessageUpdate(chatMessage, receiver);

    return chatMessage;
  }
  async getChatMessagesByChatId(chatId: string, user: User) {
    const chat = await this.chatService.getChatById(
      new mongoose.Types.ObjectId(chatId),
    );
    if (!chat) {
      throw new NotFoundException();
    }

    if (
      chat.user1._id.toString() !== user._id.toString() &&
      chat.user2._id.toString() !== user._id.toString()
    ) {
      throw new UnauthorizedException();
    }

    return this.chatMessage
      .find({
        chatId: new mongoose.Types.ObjectId(chatId),
      })
      .populate('sender', ['-email', '-roles'])
      .sort({ createdAt: 'asc' });
  }
}

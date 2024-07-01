import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from '../schemas/chat';
import mongoose from 'mongoose';
import { UsersService } from '../../user-management/services/users.service';
import { User } from '../../user-management/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chat: Model<Chat>,
    private readonly usersService: UsersService,
  ) {}

  async createChat(user1: User, user2: User) {
    const chat = await this.chat.create({
      user1: user1,
      user2: user2,
    });
    return chat;
  }

  async getOneChatByParticipant(userId1: string, userId2: string) {
    return this.chat
      .findOne({
        $or: [
          {
            $and: [
              { user1: new mongoose.Types.ObjectId(userId1) },
              { user2: new mongoose.Types.ObjectId(userId2) },
            ],
          },
          {
            $and: [
              { user1: new mongoose.Types.ObjectId(userId2) },
              { user2: new mongoose.Types.ObjectId(userId1) },
            ],
          },
        ],
      })
      .populate('user1', ['-email', '-roles'])
      .populate('user2', ['-email', '-roles']);
  }

  async getChatByUserId(userId: string) {
    return this.chat
      .find({
        $or: [
          { user1: new mongoose.Types.ObjectId(userId) },
          { user2: new mongoose.Types.ObjectId(userId) },
        ],
      })
      .sort({ lastMessageAt: 'desc' })
      .populate('user1', ['-email', '-roles'])
      .populate('user2', ['-email', '-roles']);
  }

  async getChatById(id: mongoose.Types.ObjectId) {
    return this.chat
      .findById(id)
      .populate('user1', ['-email', '-roles'])
      .populate('user2', ['-email', '-roles']);
  }
}

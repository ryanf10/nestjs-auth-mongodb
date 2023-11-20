import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UsersService } from '../user-management/services/users.service';
import { NotificationsGateway } from './notifications.gateway';
import * as mongoose from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notification: Model<Notification>,
    private readonly userService: UsersService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async getAlL() {
    return this.notification.find();
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const receiver = await this.userService.findOneById(
      createNotificationDto.receiver,
    );
    if (!receiver) {
      throw new NotFoundException("Receiver doesn't exist");
    }
    const createdNotification = new this.notification({
      message: createNotificationDto.message,
      receiver: receiver,
    });
    await createdNotification.save();
    await this.notificationsGateway.sendNotification(createdNotification);
    return createdNotification;
  }

  async getNotificationsByUserId(user_id: string) {
    return this.notification
      .find({
        receiver: new mongoose.Types.ObjectId(user_id),
      })
      .sort({ createdAt: 'desc' });
  }
}

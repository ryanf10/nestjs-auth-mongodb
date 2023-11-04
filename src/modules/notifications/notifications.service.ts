import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notification: Model<Notification>,
    private readonly userService: UsersService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async getAlL() {
    return this.notification.find().exec();
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

    await this.notificationsGateway.sendNotification(
      createdNotification.message,
      createdNotification.receiver._id,
    );
    return createdNotification.save();
  }
}

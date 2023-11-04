import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification';
import { NotificationsService } from './notifications.service';
import { UsersModule } from '../users/users.module';
import { NotificationsController } from './notifications.controller';
import { jwtModule, redisModule } from '../../modules.config';

@Module({
  imports: [
    UsersModule,
    jwtModule,
    redisModule,
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory: () => {
          return NotificationSchema;
        },
      },
    ]),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}

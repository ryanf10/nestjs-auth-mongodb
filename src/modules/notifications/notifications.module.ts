import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { jwtModule } from '../../modules.config';

@Module({
  imports: [
    jwtModule,
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

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AllowedRole } from '../../core/decorators/allowed-role.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowedRole(['admin'])
  @Post('create')
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationService.create(
      createNotificationDto,
    );
    return { data: notification };
  }
}

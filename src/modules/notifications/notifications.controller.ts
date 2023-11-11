import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification-dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AllowedRole } from '../../core/decorators/allowed-role.decorator';
import { UserRequest } from '../../core/decorators/user-request.decorator';
import { User } from '../users/schemas/user.schema';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getNotificationsByUserId(@UserRequest() user: User) {
    console.log(user);
    return {
      data: await this.notificationService.getNotificationsByUserId(user._id),
    };
  }
}

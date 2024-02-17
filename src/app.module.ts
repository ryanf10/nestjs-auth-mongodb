import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { GlobalChatModule } from './modules/global-chat/global-chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CommandModule } from 'nestjs-command';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { cacheModule, jwtModule } from './modules.config';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `${
        process.env.NODE_ENV == 'testing'
          ? process.env.MONGODB_TESTING_URL
          : process.env.MONGODB_URL
      }`,
      {
        dbName:
          process.env.NODE_ENV == 'testing'
            ? process.env.MONGODB_TESTING_DATABASE
            : process.env.MONGODB_DATABASE,
      },
    ),
    GlobalChatModule,
    NotificationsModule,
    CommandModule,
    cacheModule,
    UserManagementModule,
    jwtModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

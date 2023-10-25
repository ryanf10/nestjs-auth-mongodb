import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from '../../core/interceptors/response-interceptor';
import { User } from '../users/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return { data: { token: await this.authService.login(req.user) } };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return { data: req.user };
  }
}

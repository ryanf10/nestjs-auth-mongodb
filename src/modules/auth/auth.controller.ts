import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Response } from '../../core/interceptors/response-interceptor';
import { User } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @HttpCode(200)
  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }
}

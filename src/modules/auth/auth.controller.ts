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
import { Response } from '../../core/interceptors/response.interceptor';
import { User } from '../users/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRequest } from '../../core/decorators/user-request.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AllowedRole } from '../../core/decorators/allowed-role.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../users/dto/user-login.dto';

@ApiTags('auth')
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

  @ApiBody({ type: UserLoginDto })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return { data: { token: await this.authService.login(req.user) } };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@UserRequest() user: User): Promise<Response<User>> {
    return { data: user };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowedRole(['admin'])
  @Get('test')
  async test(@UserRequest() user: User): Promise<Response<User>> {
    return { data: user };
  }
}

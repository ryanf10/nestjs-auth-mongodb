import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiResponse } from '../../../core/interceptors/response.interceptor';
import { User } from '../schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { UserRequest } from '../../../core/decorators/user-request.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { AllowedRole } from '../../../core/decorators/allowed-role.decorator';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dtos/user-login.dto';
import { RealIP } from 'nestjs-real-ip';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('/register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    return { data: user };
  }

  @ApiBody({ type: UserLoginDto })
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Req() req: ExpressRequest & { user: User },
    @Res({ passthrough: true }) res: ExpressResponse,
    @RealIP() ip: string,
  ) {
    await this.authService.sendLoginNotification(req.user, ip);
    const data = await this.authService.login(req.user);
    res.cookie('access_token', data.access_token, {
      httpOnly: true,
      signed: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      signed: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { data };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@UserRequest() user: User): Promise<ApiResponse<User>> {
    return { data: user };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowedRole(['admin'])
  @Get('test')
  async test(@UserRequest() user: User): Promise<ApiResponse<User>> {
    return { data: user };
  }

  @ApiBearerAuth('Refresh-JWT-auth')
  @UseGuards(AuthGuard('refresh'))
  @Get('refresh')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const data = await this.authService.newAccessToken(
      req.user.data,
      req.user.refreshToken,
      res,
    );
    res.cookie('access_token', data.access_token, {
      httpOnly: true,
      signed: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return {
      data,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: ExpressResponse) {
    //delete cookie
    await this.authService.clearCookies(res);
    return {
      data: { success: true },
    };
  }
}

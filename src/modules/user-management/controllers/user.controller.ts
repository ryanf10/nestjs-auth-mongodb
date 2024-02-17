import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchUserDto } from '../dtos/search-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Get('/search')
  @UseGuards(AuthGuard('jwt'))
  async search(@Query() query: SearchUserDto) {
    return { data: await this.usersService.search(query.keyword) };
  }
}

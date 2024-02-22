import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SearchUserDto } from '../dtos/search-user.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRequest } from '../../../core/decorators/user-request.decorator';
import { User } from '../schemas/user.schema';
import path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { getContentType } from '../../../core/uploader/uploader';

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

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @HttpCode(200)
  @Patch('/profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('picture'))
  async updateProfile(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    picture: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @UserRequest() user: User,
  ) {
    return {
      data: await this.usersService.updateProfile(
        picture,
        updateProfileDto,
        user,
      ),
    };
  }

  // this endpoint used to return image (if the STORAGE is set to 'local')
  @Get('/profile/picture/:filename')
  async downloadProfilePicture(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const fullPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'src',
      'storage',
      'profile',
      'picture',
      filename,
    );
    // Check if the file exists
    try {
      fs.statSync(fullPath);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }

    // Set the appropriate headers for the file download
    res.setHeader('Content-Type', getContentType(filename));
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    // Create a read stream to the file and pipe it to the response object
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RolesService } from './roles.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import {
  ENCRYPTION_KEY,
  ENCRYPTION_SALT,
} from '../../../core/constants/encryption';
import process from 'process';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { getFileExtension, uploader } from '../../../core/uploader/uploader';
import { PaginationBuilder } from '../../../core/builder/pagination';
import { SearchUserDto } from '../dtos/search-user.dto';
import { GetAllUserDto } from '../dtos/get-all-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly roleService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userRole = await this.roleService.getRoleByName('user');
    if (!userRole) {
      throw new InternalServerErrorException('cannot assign role');
    }
    const createdUser = new this.user({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await this.hash(createUserDto.password),
      roles: [userRole],
    });
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.user.findOne({ email: email }).populate('roles');
  }

  async findOneById(id: string): Promise<User> {
    return this.user.findById(id).populate('roles');
  }

  async hash(value: string) {
    return await bcrypt.hash(value, 10);
  }

  async compareHash(value: string, hashed: string) {
    return await bcrypt.compare(value, hashed);
  }

  async newRefreshToken(id: string) {
    return await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION },
    );
  }

  async getOrUpdateRefreshToken(id: string) {
    const user = await this.user.findById(id);
    let cipherToken = user.refreshToken;
    let plainToken = null;
    try {
      plainToken = this.decrypt(cipherToken);
      await this.jwtService.verifyAsync(plainToken);
    } catch (e) {
      plainToken = await this.newRefreshToken(id);
      cipherToken = this.encrypt(plainToken);
      user.refreshToken = cipherToken;
      await user.save();
    }
    return plainToken;
  }

  async search(searchUserDto: SearchUserDto) {
    return await PaginationBuilder(
      this.user
        .find(
          searchUserDto.keyword && {
            $or: [
              { email: { $regex: searchUserDto.keyword, $options: 'i' } },
              { username: { $regex: searchUserDto.keyword, $options: 'i' } },
            ],
          },
        )
        .select(['-email', '-roles']),
      'users',
      searchUserDto,
    );
  }

  async getAll(getAllUserDto: GetAllUserDto) {
    const filter = {};

    if (getAllUserDto.keyword) {
      filter['$or'] = [
        { email: { $regex: getAllUserDto.keyword, $options: 'i' } },
        { username: { $regex: getAllUserDto.keyword, $options: 'i' } },
      ];
    }
    if (getAllUserDto.role) {
      const roles = await this.roleService.getRoleInNameArray(
        getAllUserDto.role.split(','),
      );
      filter['roles'] = { $in: roles.map((role) => role._id) };
    }
    return await PaginationBuilder(
      this.user.find(filter).populate('roles'),
      'users',
      getAllUserDto,
    );
  }

  async updateProfile(
    picture: Express.Multer.File,
    updateProfileDto: UpdateProfileDto,
    user: User,
  ) {
    const userData = await this.user.findById(user._id);

    const uploadRes = await uploader(
      picture,
      'profile/picture/',
      `${user._id}-${new Date().getTime().toString()}${getFileExtension(
        picture,
      )}`,
    );
    userData.picture = `${uploadRes}`;
    userData.save();
    return userData;
  }

  //Encrypting text
  encrypt(text: string): string {
    const derivedKey = crypto.scryptSync(ENCRYPTION_KEY, ENCRYPTION_SALT, 32);
    const AES_KEY: Buffer = derivedKey.slice(0, 32); // 32 bytes for AES-256
    const AES_IV: Buffer = derivedKey.slice(16, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let encrypted = cipher.update(text, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  // Decrypting text
  decrypt(ciphertext: string): string {
    const derivedKey = crypto.scryptSync(ENCRYPTION_KEY, ENCRYPTION_SALT, 32);
    const AES_KEY: Buffer = derivedKey.slice(0, 32); // 32 bytes for AES-256
    const AES_IV: Buffer = derivedKey.slice(16, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
    let decrypted = decipher.update(ciphertext, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}

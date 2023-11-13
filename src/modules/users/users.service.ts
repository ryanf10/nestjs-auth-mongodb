import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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
    return await this.jwtService.signAsync({ id }, { expiresIn: '15m' });
  }

  async getOrUpdateRefreshToken(id: string) {
    const user = await this.user.findById(id);
    let cipherToken = user.refreshToken;
    let plainToken = null;
    try {
      await this.jwtService.verifyAsync(cipherToken);
      plainToken = this.decrypt(cipherToken);
    } catch (e) {
      plainToken = await this.newRefreshToken(id);
      cipherToken = await this.encrypt(plainToken);
      user.refreshToken = cipherToken;
      await user.save();
    }
    return plainToken;
  }

  //Encrypting text
  encrypt(text) {
    return text;
  }

  // Decrypting text
  decrypt(text) {
    return text;
  }
}

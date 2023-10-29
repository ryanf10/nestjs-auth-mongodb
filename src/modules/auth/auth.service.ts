import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const isMatch = await this.userService.comparePassword(
        password,
        user.password,
      );
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = { id: user._id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

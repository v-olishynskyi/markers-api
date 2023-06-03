import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtServices: JwtService,
  ) {}

  async signIn(body: SignInDto) {
    const user = await this.usersService.getByEmail(body.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}

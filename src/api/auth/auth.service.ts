import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/auth.dto';
import { CreateUserDto, UserDto } from 'src/api/users/dto/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private static async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isComparePassword = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isComparePassword)
      throw new UnauthorizedException('Incorrect password', {
        cause: new Error('invalid_password'),
      });

    return true;
  }

  async signIn(body: SignInDto) {
    const user = await this.usersService.getByEmail(body.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await AuthService.verifyPassword(body.password, user.password);

    return {
      access_token: await this.jwtService.signAsync(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }

  async register(registrationData: CreateUserDto): Promise<UserDto> {
    return await this.usersService.create(registrationData);
  }
}

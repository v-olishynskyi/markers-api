import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDataDto, SignInResponseDto } from './dto/auth.dto';
import { CreateUserDto, UserDto } from 'src/models/users/dto/users.dto';
import { UsersService } from 'src/models/users/users.service';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { ACCESS_TOKEN_EXPIRED_SEC } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userSessionsModel: UserSessionsRepository,
  ) {}

  async signIn(
    body: SignInDataDto,
    userAgent: string,
  ): Promise<SignInResponseDto> {
    const user = await this.usersService.getByEmail(body.email);

    await AuthService.verifyPassword(body.password, user.password);

    const { id: userSessionId } = await this.userSessionsModel.create({
      user_id: user.id,
      device: userAgent,
    });

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
      userSessionId,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      session_id: userSessionId,
      user,
    };
  }

  async signUp(registrationData: CreateUserDto): Promise<UserDto> {
    return await this.usersService.create(registrationData);
  }

  async logout(sessionId: string) {
    return await this.userSessionsModel.delete(sessionId);
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const decoded: any = await this.jwtService.decode(refreshToken);

    const userSessionId = decoded['userSessionId'];

    const userSession = await this.userSessionsModel.one({
      id: userSessionId || '',
    });

    if (!userSession) {
      throw new UnauthorizedException('No user session found');
    }

    const { accessToken } = await this.getTokens(
      userSession.user_id,
      userSession.user.email,
      userSessionId,
    );

    return { access_token: accessToken };
  }

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

  async getTokens(userId: string, email: string, userSessionId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          userId,
          email,
          userSessionId,
        },
        { expiresIn: ACCESS_TOKEN_EXPIRED_SEC },
      ),
      await this.jwtService.signAsync(
        {
          userSessionId,
        },
        { expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}

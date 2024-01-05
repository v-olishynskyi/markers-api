import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { ACCESS_TOKEN_EXPIRED_SEC } from 'src/common/constants';
import { SignInDto, SignInResponseDto } from 'src/api/auth/dto';
import { CreateUserDto } from 'src/models/users/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async signIn(
    body: SignInDto,
    ip: string | null,
    app_version: string | null,
  ): Promise<SignInResponseDto> {
    const user = await this.usersService.getByEmail(body.email);

    await AuthService.verifyPassword(body.password, user.password);

    const location = '';

    const { id: userSessionId } = await this.userSessionsRepository.create({
      user_id: user.id,
      // eslint-disable-next-line
      // @ts-ignore
      device: body.device,
      ip,
      app_version,
      location,
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
    };
  }

  async signUp(registrationData: CreateUserDto) {
    return await this.usersService.create(registrationData);
  }

  async logout(sessionId: string) {
    try {
      if (sessionId) {
        return await this.userSessionsRepository.delete(sessionId);
      } else {
        return true;
      }
    } catch (error) {
      console.log('asdsadas');

      return new UnauthorizedException('Expired token', 'expired_token');
    }
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const decodedData: any = await this.jwtService.decode(refreshToken);

    const userSessionId = decodedData['userSessionId'];

    try {
      const userSession = await this.userSessionsRepository.one({
        id: userSessionId || '',
      });

      if (!userSession || !userSession?.user) {
        throw new UnauthorizedException('No user session found');
      }

      const { accessToken } = await this.getTokens(
        userSession.user_id,
        userSession.user.email,
        userSessionId,
      );

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Session terminated',
        'session_terminated',
      );
    }
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

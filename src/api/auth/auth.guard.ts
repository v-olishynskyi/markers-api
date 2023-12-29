import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userSessionsRepository: UserSessionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'No access token provided',
        'expired_token',
      );
    }

    return this.jwtService
      .verifyAsync(token)
      .then(async (payload) => {
        try {
          const userSession = await this.userSessionsRepository.one({
            id: payload['userSessionId'],
          });

          if (!userSession) {
            throw new UnauthorizedException(
              'Session terminated',
              'session_terminated',
            );
          }
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['userId'] = payload['userId'];
          request['userSessionId'] = payload['userSessionId'];

          return true;
        } catch (error) {
          throw new UnauthorizedException(
            'Session terminated',
            'session_terminated',
          );
        }
      })
      .catch(() => {
        throw new UnauthorizedException('Expired token', 'expired_token');
      });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

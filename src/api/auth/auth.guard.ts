import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log(
        'file: auth.guard.ts:22 - AuthGuard - canActivate - payload:',
        payload,
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['userId'] = payload['userId'];
    } catch (error) {
      console.log(
        'file: auth.guard.ts:30 - AuthGuard - canActivate - error:',
        error,
      );
      throw new UnauthorizedException('Expired token', 'expired_token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

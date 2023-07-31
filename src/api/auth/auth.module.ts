import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/models/users/users.module';
import { UserSessionsRepository } from './user-sessions.repository';
import { userSessionsProviders } from 'src/api/auth/user-sessions.provider';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWTKEY,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserSessionsRepository, ...userSessionsProviders],
})
export class AuthModule {}

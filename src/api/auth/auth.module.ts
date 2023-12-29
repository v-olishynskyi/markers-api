import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/models/users/users.module';
import { UserSessionsRepository } from './user-sessions.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWTKEY,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserSessionsRepository],
})
export class AuthModule {}

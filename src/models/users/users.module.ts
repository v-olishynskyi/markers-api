import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersRepository, UserSessionsRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

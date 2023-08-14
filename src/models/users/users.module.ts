import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersRepository } from './users.repository';
import { DatabaseModule } from 'src/providers/database/postgres/database.module';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { userSessionsProviders } from 'src/api/auth/user-sessions.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [
    UsersService,
    UsersRepository,
    ...usersProviders,
    UserSessionsRepository,
    ...userSessionsProviders,
  ],
})
export class UsersModule {}

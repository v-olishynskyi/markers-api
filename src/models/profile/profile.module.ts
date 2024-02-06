import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersRepository } from 'src/models/users/users.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UsersService } from 'src/models/users/users.service';
import { FilesRepository } from 'src/models/files/files.repository';
import { FilesService } from 'src/models/files/files.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UsersRepository,
    UserSessionsRepository,
    UsersService,
    FilesRepository,
    FilesService,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}

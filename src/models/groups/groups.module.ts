import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersService } from 'src/models/users/users.service';
import { UsersRepository } from 'src/models/users/users.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { FilesService } from 'src/models/files/files.service';
import { FilesRepository } from 'src/models/files/files.repository';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [
    GroupsRepository,
    GroupsService,
    UsersRepository,
    UserSessionsRepository,
    UsersService,
    FilesRepository,
    FilesService,
  ],
  exports: [GroupsService],
})
export class GroupsModule {}

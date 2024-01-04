import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { MarkersRepository } from 'src/models/markers/markers.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { FilesService } from 'src/models/files/files.service';
import { PublicFileRepository } from 'src/models/files/files.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { UsersService } from 'src/models/users/users.service';
import { UsersRepository } from 'src/models/users/users.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MarkersController],
  providers: [
    MarkersRepository,
    UserSessionsRepository,
    UsersRepository,
    PublicFileRepository,
    MarkersService,
    FilesService,
    UsersService,
  ],
  exports: [MarkersService],
})
export class MarkersModule {}

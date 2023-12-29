import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { MarkersRepository } from 'src/models/markers/markers.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { FilesService } from 'src/models/files/files.service';
import { PublicFileRepository } from 'src/models/files/files.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarkersController],
  providers: [
    MarkersRepository,
    UserSessionsRepository,
    PublicFileRepository,
    MarkersService,
    FilesService,
  ],
  exports: [MarkersService],
})
export class MarkersModule {}

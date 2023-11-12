import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { markersProviders } from './markers.providers';
import { DatabaseModule } from 'src/providers/database/postgres/database.module';
import { MarkersRepository } from 'src/models/markers/markers.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { userSessionsProviders } from 'src/api/auth/user-sessions.provider';
import { FilesService } from 'src/models/files/files.service';
import { PublicFileRepository } from 'src/models/files/files.repository';
import { publicFileProviders } from 'src/models/files/files.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    MarkersService,
    FilesService,
    MarkersRepository,
    ...markersProviders,
    UserSessionsRepository,
    ...userSessionsProviders,
    PublicFileRepository,
    ...publicFileProviders,
  ],
  controllers: [MarkersController],
  exports: [MarkersService],
})
export class MarkersModule {}

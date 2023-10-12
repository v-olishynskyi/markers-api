import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { markersProviders } from './markers.providers';
import { DatabaseModule } from 'src/providers/database/postgres/database.module';
import { MarkersRepository } from 'src/models/markers/markers.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { userSessionsProviders } from 'src/api/auth/user-sessions.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    MarkersService,
    MarkersRepository,
    ...markersProviders,
    UserSessionsRepository,
    ...userSessionsProviders,
  ],
  controllers: [MarkersController],
  exports: [MarkersService],
})
export class MarkersModule {}

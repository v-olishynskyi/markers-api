import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { markersProviders } from './markers.providers';
import { DatabaseModule } from 'src/providers/database/postgres/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MarkersService, ...markersProviders],
  controllers: [MarkersController],
  exports: [MarkersService],
})
export class MarkersModule {}

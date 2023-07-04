import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';
import { markersProviders } from 'src/api/markers/markers.providers';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MarkersService, ...markersProviders],
  controllers: [MarkersController],
  exports: [MarkersService],
})
export class MarkersModule {}

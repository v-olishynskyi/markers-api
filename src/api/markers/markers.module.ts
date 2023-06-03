import { Module } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { MarkersController } from './markers.controller';

@Module({
  providers: [MarkersService],
  controllers: [MarkersController],
})
export class MarkersModule {}

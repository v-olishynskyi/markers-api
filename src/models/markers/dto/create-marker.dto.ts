import { OmitType } from '@nestjs/swagger';
import { MarkerDto } from 'src/models/markers/dto/marker.dto';

export class CreateMarkerDto extends OmitType(MarkerDto, [
  'id',
  'images',
] as const) {}

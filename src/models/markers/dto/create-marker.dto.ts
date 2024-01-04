import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MarkerDto } from 'src/models/markers/dto/marker.dto';

export class CreateMarkerDto extends OmitType(MarkerDto, [
  'id',
  'images',
] as const) {
  @ApiProperty({
    name: 'images',
    description: 'Marker images ids',
    type: [String],
  })
  images: string[];
}

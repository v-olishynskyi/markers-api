import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { MarkerDto } from 'src/models/markers/dto/marker.dto';

export class UpdateMarkerDto extends PartialType(
  OmitType(MarkerDto, ['images'] as const),
) {
  @ApiProperty({
    name: 'images',
    description: 'Marker images ids',
    type: [String],
  })
  images: string[];
}

import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { MarkerDto } from 'src/models/markers/dto/marker.dto';

export class UpdateMarkerDto extends PartialType(
  OmitType(MarkerDto, ['id', 'images'] as const),
) {
  @ApiProperty({ name: 'images', type: [String] })
  images: string[];
}

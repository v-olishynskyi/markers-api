import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PublicFileDto } from 'src/models/files/dto/public-file.dto';

export class MarkerDto {
  @ApiProperty({
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
    description: 'Unique marker id',
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  name: string;

  @ApiProperty({ nullable: true, default: null })
  description: string | null;

  @ApiProperty({ default: 50.430397616916096, type: Number })
  latitude: number;

  @ApiProperty({ default: 30.541007622159007, type: Number })
  longitude: number;

  @ApiProperty({
    name: 'is_draft',
    description: 'Indicates that marker is draft. ',
    default: false,
    type: Boolean,
  })
  is_draft: boolean;

  @ApiProperty({
    name: 'is_hidden',
    description: 'Indicates that marker is hidden. ',
    default: false,
    type: Boolean,
  })
  is_hidden: boolean;

  @ApiProperty({
    name: 'images',
    description: 'Marker images',
    type: [PublicFileDto],
  })
  images: PublicFileDto[];

  @ApiProperty()
  user_id: string;
}

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
export class UpdateMarkerDto extends OmitType(MarkerDto, [
  'id',
  'images',
] as const) {}

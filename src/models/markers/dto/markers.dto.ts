import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { PublicFileDto } from 'src/models/files/dto/public-file.dto';

export class MarkerDto {
  @ApiProperty({
    example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D',
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
    description: 'Marker images',
    type: String,
  })
  images: string[];
}
export class UpdateMarkerDto extends OmitType(MarkerDto, [
  'id',
  'images',
] as const) {
  @ApiProperty({
    name: 'images',
    description: 'Marker images',
    type: String,
  })
  images: string[];
}

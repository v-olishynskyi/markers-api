import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import {
  ApiPropertyExamplesEnum,
  ValidationMessagesEnum,
} from 'src/common/shared/enums';
import { PublicFileDto } from 'src/models/files/dto';

export class MarkerDto {
  @ApiProperty({
    example: ApiPropertyExamplesEnum.Uuid,
    description: 'Unique marker id',
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  name: string;

  @ApiProperty({ nullable: true, default: null })
  description: string | null;

  @ApiProperty({ default: 50.430397616916096, type: Number })
  latitude: number;

  @ApiProperty({ default: 30.541007622159007, type: Number })
  longitude: number;

  @ApiProperty({
    name: 'is_draft',
    description: 'Indicates that marker is draft.',
    default: false,
    type: Boolean,
  })
  is_draft: boolean;

  @ApiProperty({
    name: 'is_hidden',
    description: 'Indicates that marker is hidden.',
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
  author_id: string;
}

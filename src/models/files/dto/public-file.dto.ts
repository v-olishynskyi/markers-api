import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';
import { FileTypeEnum } from 'src/models/files/enums';

export class PublicFileDto {
  @ApiProperty({
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
    description: 'Unique file id',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString({ message: 'must be a string' })
  url: string;

  @ApiProperty({
    type: String,
    description: 'Unique S3 key identifier',
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d-image',
  })
  @IsNullOrType('string', { message: 'must be a string' })
  key: string | null;

  @ApiProperty({
    type: String,
    description: 'User id reference',
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d-image',
  })
  @IsNullOrType('string', { message: 'must be a string' })
  user_id: string | null;

  @ApiProperty({
    type: String,
    description: 'Marker id reference',
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d-image',
  })
  @IsNullOrType('string', { message: 'must be a string' })
  marker_id: string | null;
}

export class CreateFileDto extends OmitType(PublicFileDto, ['id'] as const) {}
export class UpdateFileDto extends PartialType(
  OmitType(PublicFileDto, ['id'] as const),
) {}

export class FileBodyDto {
  @ApiProperty({
    name: 'entity_type',
    example: 'avatar',
    enum: FileTypeEnum,
  })
  entity_type: FileTypeEnum;

  @ApiProperty({
    name: 'entity_id',
    description: 'UUID of entity',
    type: String,
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
  })
  entity_id: string;
}

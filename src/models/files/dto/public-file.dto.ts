import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';

export class PublicFileDto {
  @ApiProperty({
    example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D',
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
    example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D-image',
  })
  @IsNullOrType('string', { message: 'must be a string' })
  key: string | null;
}

export class CreateFileDto extends OmitType(PublicFileDto, ['id'] as const) {}

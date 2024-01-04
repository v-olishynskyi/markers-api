import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from 'src/models/files/enums';

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

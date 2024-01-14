import { ApiProperty } from '@nestjs/swagger';
import { FileTypeEnum } from '..//enums';
import { IsUUID } from 'class-validator';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';

class ConnectedEntity {
  @ApiProperty({
    type: FileTypeEnum,
    enum: FileTypeEnum,
  })
  type: FileTypeEnum;

  @ApiProperty({
    name: 'Entity id',
    example: ApiPropertyExamplesEnum.Uuid,
  })
  @IsUUID()
  id: string;
}

export class CreateFileDto {
  @ApiProperty({
    name: 'File',
  })
  file: Express.Multer.File;

  @ApiProperty({ name: 'Connected entity', type: ConnectedEntity })
  entity: ConnectedEntity;
}

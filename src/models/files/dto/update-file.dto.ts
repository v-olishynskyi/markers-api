import { OmitType, PartialType } from '@nestjs/swagger';
import { PublicFileDto } from 'src/models/files/dto/public-file.dto';

export class UpdateFileDto extends PartialType(
  OmitType(PublicFileDto, ['id'] as const),
) {}

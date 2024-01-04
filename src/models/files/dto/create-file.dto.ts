import { OmitType } from '@nestjs/swagger';
import { PublicFileDto } from 'src/models/files/dto/public-file.dto';

export class CreateFileDto extends OmitType(PublicFileDto, ['id'] as const) {}

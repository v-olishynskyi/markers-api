import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { IsNullOrType } from 'src/common/decorators';
import {
  ApiPropertyExamplesEnum,
  TypesEnum,
  ValidationMessagesEnum,
} from 'src/common/shared/enums';

export class PublicFileDto {
  @ApiProperty({
    description: 'Unique file id',
    example: ApiPropertyExamplesEnum.Uuid,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  url: string;

  @ApiProperty({
    type: String,
    description: 'Unique S3 key identifier',
    example: `${ApiPropertyExamplesEnum.Uuid}-image`,
  })
  @IsNullOrType(TypesEnum.String, {
    message: ValidationMessagesEnum.MustBeString,
  })
  key: string | null;

  @ApiProperty({
    type: String,
    description: 'User id reference',
    example: `${ApiPropertyExamplesEnum.Uuid}-image`,
  })
  @IsNullOrType(TypesEnum.String, {
    message: ValidationMessagesEnum.MustBeString,
  })
  user_id: string | null;

  @ApiProperty({
    type: String,
    description: 'Marker id reference',
    example: `${ApiPropertyExamplesEnum.Uuid}-image`,
  })
  @IsNullOrType(TypesEnum.String, { message: 'must be a string' })
  marker_id: string | null;
}

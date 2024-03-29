import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from 'src/models/users/dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['id', 'avatar', 'password'] as const),
) {
  file: Express.Multer.File;
}

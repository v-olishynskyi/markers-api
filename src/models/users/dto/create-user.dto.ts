import { OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/models/users/dto';

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'avatar',
] as const) {}

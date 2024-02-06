import { OmitType, PartialType } from '@nestjs/swagger';
import { UserProfileDto } from 'src/models/profile/dto/user-profile.dto';

export class UpdateProfileDto extends PartialType(
  OmitType(UserProfileDto, [
    'id',
    'avatar',
    'email',
    'password',
    'sessions',
    'groups',
  ]),
) {}

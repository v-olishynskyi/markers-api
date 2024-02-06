import { ApiProperty } from '@nestjs/swagger';
import { UserSessionDto } from 'src/api/auth/dto';
import { GroupDto } from 'src/models/groups/dto';
import { UserDto } from 'src/models/users/dto';

export class UserProfileDto extends UserDto {
  @ApiProperty({ name: 'sessions', type: [UserSessionDto] })
  sessions: UserSessionDto[];

  @ApiProperty({ name: 'groups', type: [GroupDto] })
  groups: GroupDto[];
}

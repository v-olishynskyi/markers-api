import { OmitType } from '@nestjs/swagger';
import { GroupDto } from 'src/models/groups/dto/group.dto';

export class CreateGroupDto extends OmitType(GroupDto, [
  'id',
  'members',
] as const) {}

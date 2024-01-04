import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { GroupDto } from 'src/models/groups/dto';

export class UpdateGroupDto extends PartialType(
  OmitType(GroupDto, ['id', 'members'] as const),
) {}

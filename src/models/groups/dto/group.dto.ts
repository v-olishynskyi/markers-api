import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import {
  ApiPropertyExamplesEnum,
  ValidationMessagesEnum,
} from 'src/common/shared/enums';
import { UserDto } from 'src/models/users/dto';

export class GroupDto {
  @ApiProperty({
    example: ApiPropertyExamplesEnum.Uuid,
    description: 'Unique marker id',
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  name: string;

  @ApiProperty({
    example: ApiPropertyExamplesEnum.Uuid,
    description: 'Group owner id',
  })
  @IsUUID()
  owner_id: string;

  @ApiProperty({ name: 'owner', description: 'Group owner', type: UserDto })
  owner: UserDto;

  @ApiProperty({ name: 'members', type: [UserDto] })
  members: UserDto[];

  @ApiProperty({ name: 'is_member', type: Boolean })
  is_member: boolean;

  @ApiProperty({ name: 'is_owner', type: Boolean })
  is_owner: boolean;
}

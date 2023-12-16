import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { UserDto } from 'src/models/users/dto/users.dto';

export class GroupDto {
  @ApiProperty({
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
    description: 'Unique marker id',
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  name: string;

  @ApiProperty({ name: 'members', type: [UserDto] })
  members: UserDto[];
}

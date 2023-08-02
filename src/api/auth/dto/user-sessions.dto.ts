import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/models/users/dto/users.dto';

export class UserSessionDto {
  @ApiProperty({ name: 'id', example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D' })
  id: string;

  @ApiProperty({
    name: 'user_id',
    example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D',
  })
  user_id: string;

  @ApiProperty({ name: 'user', type: UserDto })
  user: UserDto;

  @ApiProperty({
    name: 'device',
    example:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15',
  })
  device: string;
}

export class CreateUserSessionDto extends OmitType(UserSessionDto, [
  'id',
  'user',
] as const) {}

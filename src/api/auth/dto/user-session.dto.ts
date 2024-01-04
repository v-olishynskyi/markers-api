import { ApiProperty } from '@nestjs/swagger';
import { UserSessionDeviceDto } from 'src/api/auth/dto';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';
import { UserDto } from 'src/models/users/dto';

export class UserSessionDto {
  @ApiProperty({ name: 'id', example: ApiPropertyExamplesEnum.Uuid })
  id: string;

  @ApiProperty({
    name: 'user_id',
    example: ApiPropertyExamplesEnum.Uuid,
  })
  user_id: string;

  @ApiProperty({ name: 'user', type: UserDto })
  user: UserDto;

  @ApiProperty({
    name: 'device',
    example: {
      id: 'ABCDEF12-34567890ABCDEF12',
      name: 'iPhone',
      platform: 'iOS',
    } as UserSessionDeviceDto,
    type: UserSessionDeviceDto,
    nullable: true,
  })
  device: UserSessionDeviceDto | null;

  @ApiProperty({
    name: 'ip',
    example: ApiPropertyExamplesEnum.IP,
    type: String,
    nullable: true,
    default: null,
  })
  ip: string | null;

  @ApiProperty({
    name: 'app_version',
    type: String,
    nullable: true,
    default: null,
  })
  app_version: string | null;

  @ApiProperty({
    name: 'location',
    type: String,
    nullable: true,
    default: null,
  })
  location: string | null;
}

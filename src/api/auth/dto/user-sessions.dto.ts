import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { UserDto } from 'src/models/users/dto/users.dto';

export enum Platforms {
  IOS = 'iOS',
  ANDROID = 'Android',
  MACOS = ' acOS',
  DESKTOP = 'Desktop',
}

export class UserSessionDeviceDto {
  @ApiProperty({ name: 'id', example: 'ABCDEF12-34567890ABCDEF12' })
  id: string;

  @ApiProperty({ name: 'name', example: 'iPhone' })
  name: string;

  @ApiProperty({
    name: 'platform',
    example: 'iOS',
    nullable: true,
  })
  platform: string;
}

export class UserSessionDto {
  @ApiProperty({ name: 'id', example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d' })
  id: string;

  @ApiProperty({
    name: 'user_id',
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
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

  @ApiProperty({ name: 'ip', type: String, nullable: true, default: null })
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

export class CreateUserSessionDto extends OmitType(UserSessionDto, [
  'id',
  'user',
] as const) {}

export class UpdateUserSessionDto extends OmitType(UserSessionDto, [
  'id',
  'user',
  'user_id',
] as const) {}

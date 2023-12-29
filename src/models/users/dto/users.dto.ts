import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserSessionDto } from 'src/api/auth/dto/user-sessions.dto';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';
import { PublicFileDto } from 'src/models/files/dto/public-file.dto';
import { GroupDto } from 'src/models/groups/dto/groups.dto';

export class UserDto {
  @ApiProperty({
    example: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
    description: 'Unique user id',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'email@email.com', description: 'User email' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty({ example: 'Qwerty1!', description: 'Password' })
  @IsString({ message: 'must be string' })
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'The password is very weak' })
  password: string;

  @ApiProperty({ name: 'first_name', example: 'John' })
  @IsString({ message: 'must be a string' })
  first_name: string;

  @ApiProperty({ name: 'last_name', example: 'Doe' })
  @IsString({ message: 'must be a string' })
  last_name: string;

  @ApiPropertyOptional({ name: 'middle_name', example: 'string or null' })
  @IsNullOrType('string', { message: 'must be a string or null' })
  middle_name: string | null;

  @ApiPropertyOptional({ name: 'username', example: 'string or null' })
  @IsNullOrType('string', { message: 'must be a string or null' })
  username: string | null;

  @ApiPropertyOptional({
    name: 'avatar_url',
    example:
      'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/292.jpg' ||
      null,
  })
  @IsNullOrType('object')
  avatar: PublicFileDto | null;
}

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'avatar',
  'username',
] as const) {}
export class UpdateUserDto extends OmitType(PartialType(UserDto), [
  'id',
  'avatar',
] as const) {}

export class UserProfileDto extends UserDto {
  @ApiProperty({ name: 'sessions', type: [UserSessionDto] })
  sessions: UserSessionDto[];

  @ApiProperty({ name: 'groups', type: [GroupDto] })
  groups: GroupDto[];
}

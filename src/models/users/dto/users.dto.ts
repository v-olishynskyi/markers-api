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
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';

export class UserDto {
  @ApiProperty({
    example: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D',
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
  @IsNullOrType('string', { message: 'must be a string' })
  avatar_url: string | null;
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}
export class UpdateUserDto extends OmitType(PartialType(UserDto), [
  'id',
] as const) {}
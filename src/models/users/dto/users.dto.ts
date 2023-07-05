import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({
    example: 'XXXX-XXXX-XXXX-XXXXXX',
    description: '',
  })
  @IsUUID()
  id: string;

  @Expose()
  @ApiProperty({ example: 'email@email.com', description: 'User email' })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsString({ message: 'must be a string' })
  email: string;

  // @Exclude()
  @ApiProperty({ example: '1234567', description: 'Password' })
  @IsString({ message: 'must be string' })
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'The password is very weak' })
  password: string;

  @Expose()
  @ApiProperty()
  @IsString({ message: 'must be a string' })
  first_name: string;

  @Expose()
  @ApiProperty()
  @IsString({ message: 'must be a string' })
  last_name: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  middle_name: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  username: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  avatar_url: string;

  // constructor(partial: Partial<UserDto>) {
  //   Object.assign(this, partial);
  // }
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}
export class UpdateUserDto extends OmitType(PartialType(UserDto), [
  'id',
] as const) {}

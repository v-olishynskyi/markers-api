import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'XXXX-XXXX-XXXX-XXXXXX',
    description: '',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({ example: 'email@email.com', description: 'User email' })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsString({ message: 'must be a string' })
  readonly email: string;

  @ApiProperty({ example: '1234567', description: 'Password' })
  @IsString({ message: 'must be string' })
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'The password is very weak' })
  readonly password: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  readonly first_name: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  readonly last_name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  readonly middle_name: string;

  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  readonly username: string;

  @ApiPropertyOptional()
  @IsString({ message: 'must be a string' })
  readonly avatar_url: string;
}

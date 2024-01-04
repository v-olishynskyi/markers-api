import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsEmail,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNullOrType } from 'src/common/decorators/IsNullOrType.decorator';
import {
  ApiPropertyExamplesEnum,
  TypesEnum,
  ValidationMessagesEnum,
} from 'src/common/shared/enums';
import { PublicFileDto } from 'src/models/files/dto';

export class UserDto {
  @ApiProperty({
    example: ApiPropertyExamplesEnum.Uuid,
    description: 'Unique user id',
  })
  @IsUUID()
  id: User['id'];

  @ApiProperty({
    example: ApiPropertyExamplesEnum.Email,
    description: 'User email',
  })
  @IsEmail({}, { message: ValidationMessagesEnum.Email })
  email: User['email'];

  @ApiProperty({ example: 'Qwerty1!', description: 'Password' })
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'The password is very weak' })
  password: User['password'];

  @ApiProperty({ name: 'first_name', example: 'John' })
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  first_name: User['first_name'];

  @ApiProperty({ name: 'last_name', example: 'Doe' })
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  last_name: User['last_name'];

  @ApiPropertyOptional({ name: 'middle_name', example: 'string or null' })
  @IsNullOrType(TypesEnum.String, { message: 'must be a string or null' })
  middle_name: User['middle_name'];

  @ApiPropertyOptional({ name: 'username', example: 'string or null' })
  @IsNullOrType(TypesEnum.String, { message: 'must be a string or null' })
  username: User['username'] | undefined;

  @ApiPropertyOptional({
    name: 'avatar',
    type: PublicFileDto,
  })
  @IsNullOrType(TypesEnum.Object)
  avatar: PublicFileDto | null;
}

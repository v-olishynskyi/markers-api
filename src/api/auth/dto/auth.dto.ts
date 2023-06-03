import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'email@email.com' })
  @IsEmail({}, { message: 'must me email' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  @Length(6, 16, { message: 'must be min 4 and max 16 symbols' })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { UserSessionDeviceDto } from 'src/api/auth/dto/user-sessions.dto';
import { UserDto } from 'src/models/users/dto/users.dto';

export class SignInDataDto {
  @ApiProperty({ name: 'email', example: 'email@email.com' })
  @IsEmail({}, { message: 'must me email' })
  email: string;

  @ApiProperty({ name: 'password', example: 'Qwerty1!' })
  @IsString({ message: 'must be a string' })
  @Length(6, 16, { message: 'must be min 4 and max 16 symbols' })
  password: string;

  @ApiProperty({ name: 'device', type: UserSessionDeviceDto })
  device: UserSessionDeviceDto;
}

export class SignInResponseDto {
  @ApiProperty({
    name: 'access_token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1RUM3QkQ4RS1CQTJCLTEyODctNDkwOS00RDE4QTRFNTc0N0QiLCJpYXQiOjE2OTAzOTgwODgsImV4cCI6MTY5MTAwMjg4OH0.pLWs56rfy-z0aYu22PjRgoh4-AGeBfOoD4W1M2O_bQ4',
  })
  access_token: string;

  @ApiProperty({
    name: 'refresh_token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1RUM3QkQ4RS1CQTJCLTEyODctNDkwOS00RDE4QTRFNTc0N0QiLCJpYXQiOjE2OTAzOTgwODgsImV4cCI6MTY5MTAwMjg4OH0.pLWs56rfy-z0aYu22PjRgoh4-AGeBfOoD4W1M2O_bQ4',
  })
  refresh_token: string;

  @ApiProperty({ name: 'session_id' })
  session_id: string;

  @ApiProperty({ name: 'user', type: UserDto })
  user: UserDto;
}

export class RefreshTokenDto {
  @ApiProperty({ name: 'refresh_token' })
  refresh_token: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ name: 'access_token' })
  access_token: string;
}

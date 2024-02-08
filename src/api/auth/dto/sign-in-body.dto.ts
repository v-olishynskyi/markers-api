import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { UserSessionDeviceDto } from 'src/api/auth/dto';
import { ValidationMessagesEnum } from 'src/common/shared/enums';

export class SignInDto {
  @ApiProperty({ name: 'email', example: 'email@email.com' })
  @IsEmail({}, { message: ValidationMessagesEnum.Email })
  email: string;

  @ApiProperty({ name: 'password', example: 'Qwerty1!' })
  @IsString({ message: ValidationMessagesEnum.MustBeString })
  @Length(6, 16, { message: 'must be min 4 and max 16 symbols' })
  password: string;

  @ApiProperty({ name: 'device', type: UserSessionDeviceDto })
  device: UserSessionDeviceDto;
}

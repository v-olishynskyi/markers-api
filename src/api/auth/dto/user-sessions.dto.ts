import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSessionDto {
  @ApiProperty({ name: 'user_id' })
  user_id: string;

  @ApiProperty({ name: 'device' })
  device: string;
}

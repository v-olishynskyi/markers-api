import { ApiProperty } from '@nestjs/swagger';

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

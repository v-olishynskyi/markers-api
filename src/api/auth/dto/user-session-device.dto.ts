import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSessionDeviceDto {
  @ApiPropertyOptional({ name: 'id', example: 'ABCDEF12-34567890ABCDEF12' })
  id?: string | undefined;

  @ApiProperty({ name: 'name', example: 'iPhone' })
  name: string;

  @ApiProperty({
    name: 'platform',
    example: 'iOS',
    nullable: true,
  })
  platform: string;
}

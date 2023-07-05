import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class MarkerDto {
  @ApiProperty({
    example: 'XXXX-XXXX-XXXX-XXXXXX',
    description: '',
  })
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString({ message: 'must be a string' })
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';

export class RefreshTokenDto {
  @ApiProperty({
    name: 'refresh_token',
    example: ApiPropertyExamplesEnum.Token,
  })
  refresh_token: string;
}

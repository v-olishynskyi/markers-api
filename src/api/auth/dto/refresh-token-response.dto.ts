import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';

export class RefreshTokenResponseDto {
  @ApiProperty({ name: 'access_token', example: ApiPropertyExamplesEnum.Token })
  access_token: string;
}

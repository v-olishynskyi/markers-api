import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';

export class SignInResponseDto {
  @ApiProperty({
    name: 'access_token',
    example: ApiPropertyExamplesEnum.Token,
  })
  access_token: string;

  @ApiProperty({
    name: 'refresh_token',
    example: ApiPropertyExamplesEnum.Token,
  })
  refresh_token: string;

  @ApiProperty({ name: 'session_id' })
  session_id: string;
}

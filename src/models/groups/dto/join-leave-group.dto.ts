import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyExamplesEnum } from 'src/common/shared/enums';

export class JoinOrLeaveGroupDto {
  @ApiProperty({ name: 'user_id' })
  user_id: ApiPropertyExamplesEnum.Uuid;
}

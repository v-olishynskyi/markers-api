import { OmitType, PartialType } from '@nestjs/swagger';
import { UserSessionDto } from 'src/api/auth/dto/user-session.dto';

export class UpdateUserSessionDto extends PartialType(
  OmitType(UserSessionDto, ['id', 'user', 'user_id'] as const),
) {}

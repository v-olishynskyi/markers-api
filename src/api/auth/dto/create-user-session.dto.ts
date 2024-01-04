import { OmitType } from '@nestjs/swagger';
import { UserSessionDto } from 'src/api/auth/dto/user-session.dto';

export class CreateUserSessionDto extends OmitType(UserSessionDto, [
  'user',
] as const) {}

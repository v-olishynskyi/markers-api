import { UserSession } from 'src/api/auth/entities/user-sessions.entity';
import { USER_SESSIONS_REPOSITORY } from 'src/common/constants';

export const userSessionsProviders = [
  {
    provide: USER_SESSIONS_REPOSITORY,
    useValue: UserSession,
  },
];

import { User } from 'src/entities/user/user.entity';
import { USERS_REPOSITORY } from 'src/core/constants';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];

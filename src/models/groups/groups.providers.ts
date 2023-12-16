import { GROUPS_REPOSITORY } from 'src/common/constants';
import { Group } from 'src/models/groups/entities/group.entity';

export const groupsProviders = [
  {
    provide: GROUPS_REPOSITORY,
    useValue: Group,
  },
];

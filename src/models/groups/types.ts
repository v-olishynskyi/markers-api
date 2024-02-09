import { Prisma } from '@prisma/client';
import { PaginationParams } from 'src/common/types';
import { GroupsFilterBy } from 'src/models/groups/enums';

export type GetGroupsRequestParams = {
  filter_by: GroupsFilterBy;
} & PaginationParams;

export type GroupIncludeType = Prisma.GroupGetPayload<{
  include: {
    owner: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        username: true;
        avatar: true;
      };
    };
    avatar: true;
    members: { select: { user: true } };
  };
}>;

import { Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { GROUPS_REPOSITORY } from 'src/common/constants';
import { GroupUsers } from 'src/models/groups/entities/group-users.entity';
import { Group } from 'src/models/groups/entities/group.entity';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class GroupsRepository {
  constructor(
    @Inject(GROUPS_REPOSITORY) private readonly groupModel: typeof Group,
  ) {}

  async one(options?: FindOptions<Group>) {
    return this.groupModel.findOne({
      include: User,
      raw: true,
      ...options,
    });
  }

  async all(options?: FindOptions<Group>) {
    return this.groupModel.findAll({
      include: [User],
      raw: true,
      nest: true,
      ...options,
    });
  }
}

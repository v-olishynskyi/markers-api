import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { Prisma } from '@prisma/client';
import { CreateGroupDto, GroupDto } from 'src/models/groups/dto';
import { UsersService } from 'src/models/users/users.service';
import { GetGroupsRequestParams, GroupIncludeType } from './types';
import { GroupsFilterBy } from 'src/models/groups/enums';
import { paginator } from 'src/common/helpers';
import { PrismaService } from 'src/database/prisma.service';

const groupInclude: Prisma.GroupInclude = {
  owner: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      username: true,
      avatar: true,
    },
  },
  avatar: true,
  members: { select: { user: true } },
};

const fieldsBySearch = ['name'];

const makeGroupWhereInput = (params: {
  filter_by: GroupsFilterBy;
  userId: string;
  search?: string;
}) => {
  const { filter_by, userId, search } = params;
  let where: Prisma.GroupWhereInput = {};

  if (search) {
    where = {
      OR: [
        ...fieldsBySearch.map((field) => ({
          [field]: { contains: search },
        })),
      ],
    };
  }

  if (
    filter_by === GroupsFilterBy.By_User ||
    filter_by === GroupsFilterBy.My_Groups
  ) {
    where = {
      ...where,
      AND: { members: { some: { user_id: { equals: userId } } } },
    };
  }

  return where;
};

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async getAll(
    userId: string,
    params: Pick<GetGroupsRequestParams, 'filter_by' | 'search'>,
  ) {
    const { filter_by = GroupsFilterBy.All, search } = params;

    const where = makeGroupWhereInput({ filter_by, userId, search });

    const groups = (await this.groupsRepository.all({
      where,
      options: {
        include: groupInclude,
      },
    })) as unknown as GroupIncludeType[];

    const transformedGroups: GroupDto[] = groups.map((group) => {
      const groupWithTransformedMembers =
        GroupsService.checkIfUserAlreadyGroupMember(
          userId,
          GroupsService.transformGroupMembers(group),
        );

      return groupWithTransformedMembers;
    });

    return transformedGroups;
  }

  async paginated(userId: string, params: Required<GetGroupsRequestParams>) {
    const { filter_by, limit, page, search } = params;

    const where = makeGroupWhereInput({ filter_by, userId, search });

    const response = await paginator<GroupIncludeType>({ limit, page })(
      this.prisma.group,
      {
        where,
        include: groupInclude,
      },
    );

    const transformedGroups: GroupDto[] = response.data.map((group) => {
      const groupWithTransformedMembers =
        GroupsService.checkIfUserAlreadyGroupMember(
          userId,
          GroupsService.transformGroupMembers(group),
        );

      return groupWithTransformedMembers;
    });

    return { ...response, data: transformedGroups };
  }

  async findById(
    id: string,
    options: Omit<Prisma.GroupFindUniqueArgs, 'where'> = {
      include: groupInclude,
    },
    userId?: string,
  ) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    const group = (await this.groupsRepository.one(
      where,
      options,
    )) as unknown as GroupIncludeType;

    if (!userId) {
      return group;
    }

    const transformedGroup = GroupsService.checkIfUserAlreadyGroupMember(
      userId,
      GroupsService.transformGroupMembers(group),
    );

    return transformedGroup;
  }

  async getById(
    id: string,
    options: Omit<Prisma.GroupFindUniqueArgs, 'where'> = {
      include: groupInclude,
    },
    userId?: string,
  ) {
    const group = await this.findById(id, options, userId);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async create(createGroupDto: CreateGroupDto) {
    const owner = await this.usersService.getById(createGroupDto.owner_id);

    return this.groupsRepository.create({
      ...createGroupDto,
      owner: { connect: owner },
    });
  }

  async update(id: string, updateGroupDto: Prisma.GroupUpdateInput) {
    await this.getById(id); // check if group exist, if not throw an error

    return this.groupsRepository.update(id, updateGroupDto, groupInclude);
  }

  async delete(id: string) {
    await this.getById(id); // check if group exist, if not throw an error

    return this.groupsRepository.delete(id);
  }

  async addMember(userId: string, groupId: string) {
    await this.usersService.getById(userId, { select: { id: true } }); // check if user exist, if not throw an error

    return await this.prisma.groupsOnUsers.create({
      data: { user_id: userId, group_id: groupId },
    });
  }

  async removeMember(userId: string, groupId: string) {
    await this.usersService.getById(userId, { select: { id: true } }); // check if user exist, if not throw an error

    const group = await this.getById(groupId, { select: { owner_id: true } });

    if (group.owner_id === userId) {
      throw new ConflictException('Власник групи не може покинути групу');
    }

    return await this.prisma.groupsOnUsers.delete({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
    });
  }

  private static transformGroupMembers(group: GroupIncludeType) {
    return {
      ...group,
      members: group.members.map((groupOnUser) => groupOnUser.user),
    };
  }

  private static checkIfUserAlreadyGroupMember(
    userId: string,
    group: any,
  ): GroupDto {
    const groupMembers = group.members.map(({ id }) => id);

    return { ...group, is_member: groupMembers.includes(userId) };
  }
}

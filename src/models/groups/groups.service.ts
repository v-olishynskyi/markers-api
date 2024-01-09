import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { Group, Prisma } from '@prisma/client';
import { CreateGroupDto } from 'src/models/groups/dto';
import { UsersService } from 'src/models/users/users.service';
import { PaginationParams } from 'src/common/types';
import { PaginationResponse } from 'src/common/helpers';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly usersService: UsersService,
  ) {}

  getAll() {
    return this.groupsRepository.all({
      options: {
        include: {
          members: true,
          owner: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    });
  }

  async paginated({ limit, page, search }: PaginationParams) {
    const _page = +page === 0 ? 1 : +page;
    const _limit = +limit;
    const offset = _page * _limit;

    const fieldsBySearch = ['name'];

    const where: Prisma.GroupWhereInput = !!search
      ? {
          OR: [
            ...fieldsBySearch.map((field) => ({
              [field]: { contains: search },
            })),
          ],
        }
      : {};

    const { count, groups } = await this.groupsRepository.paginated({
      skip: offset,
      take: _limit,
      where,
      include: { members: true, owner: true },
    });

    const last_page = Math.floor(count / _limit);
    const next_page = _page === last_page ? null : Number(_page + 1);
    const prev_page = _page === 1 ? null : _page - 1;

    const response: PaginationResponse<Group> = {
      data: groups,
      meta: {
        current_page: +_page,
        last_page,
        per_page: +_limit,
        total: count,
        next_page,
        prev_page,
        search: search || null,
      },
    };

    return response;
  }

  async findById(
    id: string,
    options?: Omit<Prisma.GroupFindUniqueArgs, 'where'>,
  ) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    const group = await this.groupsRepository.one(where, options);

    return group;
  }

  async getById(
    id: string,
    options?: Omit<Prisma.GroupFindUniqueArgs, 'where'>,
  ) {
    const group = await this.findById(id, options);

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
    await this.getById(id); // check if group exist, if not throw error

    return this.groupsRepository.update(id, updateGroupDto);
  }

  async delete(id: string) {
    await this.getById(id); // check if group exist, if not throw error

    return this.groupsRepository.delete(id);
  }
}

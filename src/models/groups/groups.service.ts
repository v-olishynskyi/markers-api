import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { Prisma } from '@prisma/client';
import { CreateGroupDto } from 'src/models/groups/dto';
import { UsersService } from 'src/models/users/users.service';

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
    await this.getById(id);

    return this.groupsRepository.update(id, updateGroupDto);
  }

  async remove(id: string) {
    await this.getById(id);

    return this.groupsRepository.delete(id);
  }
}

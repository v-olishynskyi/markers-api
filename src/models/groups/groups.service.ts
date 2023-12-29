import { Injectable, NotFoundException } from '@nestjs/common';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  findAll() {
    return this.groupsRepository.all({ options: { include: { users: true } } });
  }

  async findById(id: string, include?: Prisma.GroupInclude) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    const group = await this.groupsRepository.one(where, include);

    return group;
  }

  async getById(id: string, include?: Prisma.GroupInclude) {
    const group = await this.findById(id, include);

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  create(createGroupDto: Prisma.GroupCreateInput) {
    return this.groupsRepository.create(createGroupDto);
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

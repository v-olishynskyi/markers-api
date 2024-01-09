import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  all(
    params: {
      where?: Prisma.GroupWhereInput;
      options?: Omit<Prisma.GroupFindManyArgs, 'where'>;
    } = {},
  ) {
    const { options, where } = params;
    return this.prisma.group.findMany({
      where,
      ...options,
    });
  }

  async paginated(params: Prisma.GroupFindManyArgs) {
    const groupsQuery = this.prisma.group.findMany({
      ...params,
    });

    const countQuery = this.prisma.group.count({
      where: params.where,
    });

    const [groups, count] = await this.prisma.$transaction([
      groupsQuery,
      countQuery,
    ]);

    return { groups, count };
  }

  one(
    where: Prisma.GroupWhereUniqueInput,
    options?: Omit<Prisma.GroupFindUniqueArgs, 'where'>,
  ) {
    return this.prisma.group.findUnique({
      where,
      ...options,
    });
  }

  create(data: Prisma.GroupCreateInput, include?: Prisma.GroupInclude) {
    return this.prisma.group.create({
      data,
      include: { members: true, ...include },
    });
  }

  update(
    id: string,
    data: Prisma.GroupUpdateInput,
    include?: Prisma.GroupInclude,
  ) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    return this.prisma.group.update({
      where,
      data,
      include: { members: true, ...include },
    });
  }

  delete(id: string) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    return this.prisma.group.delete({
      where,
    });
  }
}

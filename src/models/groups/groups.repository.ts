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

  one(where: Prisma.GroupWhereUniqueInput, include?: Prisma.GroupInclude) {
    return this.prisma.group.findUnique({
      where,
      include: { users: true, ...include },
    });
  }

  create(data: Prisma.GroupCreateInput, include?: Prisma.GroupInclude) {
    return this.prisma.group.create({
      data,
      include: { users: true, ...include },
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
      include: { users: true, ...include },
    });
  }

  delete(id: string) {
    const where: Prisma.GroupWhereUniqueInput = { id };

    return this.prisma.group.delete({
      where,
    });
  }
}

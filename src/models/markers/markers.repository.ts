import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MarkersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(
    params: {
      where?: Prisma.MarkerWhereInput;
      options?: Omit<Prisma.MarkerFindManyArgs, 'where'>;
    } = {},
  ) {
    const { where, options } = params;
    return this.prisma.marker.findMany({ where, ...options });
  }

  async one(
    where: Prisma.MarkerWhereUniqueInput,
    include?: Prisma.MarkerInclude,
  ) {
    return this.prisma.marker.findUnique({
      where,
      include: { author: true, images: true, ...include },
    });
  }

  async create(data: Prisma.MarkerCreateInput) {
    return this.prisma.marker.create({ data });
  }

  async update(id: string, data: Prisma.MarkerUpdateInput) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    return this.prisma.marker.update({ where, data });
  }

  async delete(id: string) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    return this.prisma.marker.delete({ where });
  }
}

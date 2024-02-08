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

  async paginated(params: Prisma.MarkerFindManyArgs) {
    const markersQuery = this.prisma.marker.findMany({
      ...params,
    });

    const countQuery = this.prisma.marker.count({
      where: params.where,
    });

    const [markers, count] = await this.prisma.$transaction([
      markersQuery,
      countQuery,
    ]);

    return { markers, count };
  }

  async one(
    where: Prisma.MarkerWhereUniqueInput,
    options?: Omit<Prisma.MarkerFindUniqueArgs, 'where'>,
  ) {
    return this.prisma.marker.findUnique({
      where,
      ...options,
    });
  }

  async create(data: Prisma.MarkerCreateInput, include?: Prisma.MarkerInclude) {
    return this.prisma.marker.create({ data, include });
  }

  async update(
    id: string,
    data: Prisma.MarkerUpdateInput,
    include?: Prisma.MarkerInclude,
  ) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    return this.prisma.marker.update({
      where,
      data,
      include: { author: true, images: true, ...include },
    });
  }

  async delete(id: string) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    await this.prisma.marker.delete({ where });
  }
}

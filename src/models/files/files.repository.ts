import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  all(
    params: {
      where?: Prisma.PublicFileWhereInput;
      options?: Omit<Prisma.PublicFileFindManyArgs, 'where'>;
    } = {},
  ) {
    const { options, where } = params;

    return this.prisma.publicFile.findMany({ where, ...options });
  }

  one(
    where: Prisma.PublicFileWhereUniqueInput,
    options?: Omit<Prisma.PublicFileFindUniqueArgs, 'where'>,
  ) {
    return this.prisma.publicFile.findUnique({ where, ...options });
  }

  create(
    data: Prisma.PublicFileCreateInput,
    include?: Prisma.PublicFileInclude,
  ) {
    return this.prisma.publicFile.create({ data, include });
  }

  async update(
    id: string,
    data: Prisma.PublicFileUpdateInput,
    include?: Prisma.PublicFileInclude,
  ) {
    const where: Prisma.PublicFileWhereUniqueInput = { id };

    return this.prisma.publicFile.update({
      where,
      data,
      include,
    });
  }

  async delete(id: string) {
    const where: Prisma.PublicFileWhereUniqueInput = { id };

    return this.prisma.publicFile.delete({ where });
  }
}

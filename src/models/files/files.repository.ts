import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PublicFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  all() {
    return this.prisma.publicFile.findMany();
  }

  one(
    where: Prisma.PublicFileWhereUniqueInput,
    select?: Prisma.PublicFileSelect,
  ) {
    return this.prisma.publicFile.findUnique({ where, select });
  }

  create(data: Prisma.PublicFileCreateInput, select?: Prisma.PublicFileSelect) {
    return this.prisma.publicFile.create({ data, select });
  }

  async update(id: string, data: Prisma.PublicFileUpdateInput) {
    const file = await this.prisma.publicFile.update({
      where: { id },
      data,
    });

    return file;
  }

  async delete(id: string) {
    const where: Prisma.PublicFileWhereUniqueInput = { id };

    return this.prisma.publicFile.delete({ where });
  }
}

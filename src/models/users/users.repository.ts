import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from 'src/models/users/dto/users.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(
    where?: Prisma.UserWhereInput,
    options?: Omit<Prisma.UserFindManyArgs, 'where'>,
  ) {
    return this.prisma.user.findMany({
      where,
      ...options,
    });
  }

  async allByPagination({
    offset,
    limit,
    where,
  }: {
    offset?: number;
    limit?: number;
    where?: Prisma.UserWhereInput;
  }) {
    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      where,
      include: { avatar: true, _count: true },
    });
  }

  async one(where: Prisma.UserWhereUniqueInput, include?: Prisma.UserInclude) {
    return this.prisma.user.findUnique({
      where,
      include: { avatar: true, ...include },
    });
  }

  async create(data: CreateUserDto) {
    return await this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const where: Prisma.UserWhereUniqueInput = { id };

    return this.prisma.user.update({ where, data, include: { avatar: true } });
  }

  async delete(id: string) {
    const where: Prisma.UserWhereUniqueInput = { id };

    return this.prisma.user.delete({ where });
  }
}

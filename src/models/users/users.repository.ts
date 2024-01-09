import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  all(
    params: {
      where?: Prisma.UserWhereInput;
      options?: Omit<Prisma.UserFindManyArgs, 'where'>;
    } = {},
  ) {
    const { where, options } = params;

    return this.prisma.user.findMany({
      where,
      ...options,
    });
  }

  async paginated(params: Prisma.UserFindManyArgs) {
    const usersQuery = this.prisma.user.findMany({
      ...params,
    });

    const countQuery = this.prisma.user.count({
      where: params.where,
    });

    const [users, count] = await this.prisma.$transaction([
      usersQuery,
      countQuery,
    ]);

    return { users, count };
  }

  one(
    where: Prisma.UserWhereUniqueInput,
    options?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ) {
    return this.prisma.user.findUnique({
      where,
      ...options,
    });
  }

  create(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    return this.prisma.user.create({ data, include });
  }

  update(
    id: string,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude,
  ) {
    const where: Prisma.UserWhereUniqueInput = { id };

    return this.prisma.user.update({
      where,
      data,
      include: { avatar: true, ...include },
    });
  }

  delete(id: string) {
    const where: Prisma.UserWhereUniqueInput = { id };

    return this.prisma.user.delete({ where });
  }
}

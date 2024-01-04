import { Injectable } from '@nestjs/common';
import { Prisma, UserSession } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserSessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  all(options?: Prisma.UserSessionFindManyArgs) {
    return this.prisma.userSession.findMany(options);
  }

  allByUser(userId: string, include?: Prisma.UserSessionInclude) {
    return this.prisma.userSession.findMany({
      where: { user_id: userId },
      include: { user: true, ...include },
    });
  }

  one(
    where: Prisma.UserSessionWhereUniqueInput,
    include?: Prisma.UserSessionInclude,
  ) {
    return this.prisma.userSession.findUnique({
      where,
      include: { user: { select: { email: true } }, ...include },
    });
  }

  create(data: Prisma.UserSessionCreateInput): Promise<UserSession> {
    return this.prisma.userSession.create({ data });
  }

  update(
    id: string,
    data: Prisma.UserSessionUpdateInput,
  ): Promise<UserSession> {
    const where: Prisma.UserSessionWhereUniqueInput = { id };
    return this.prisma.userSession.update({ where, data });
  }

  delete(id: string) {
    const where: Prisma.UserSessionWhereUniqueInput = { id };

    return this.prisma.userSession.delete({ where });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationParams } from 'src/common/types';
import { PaginationResponse } from 'src/common/helpers';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from 'src/models/users/dto';

type UserProfile = Prisma.UserGetPayload<{
  include: {
    sessions: true;
    own_groups: true;
    avatar: true;
    groups: true;
    markers: true;
  };
}>;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async getAll() {
    return await this.usersRepository.all({
      options: {
        include: { avatar: true, groups: { select: { group: true } } },
      },
    });
  }

  async paginated({ limit, page, search }: PaginationParams) {
    const _page = +page === 0 ? 1 : +page;
    const _limit = +limit;
    const offset = _page * _limit;

    const fieldsBySearch = [
      'last_name',
      'first_name',
      'middle_name',
      'email',
      'username',
    ];

    const where: Prisma.UserWhereInput = !!search
      ? {
          OR: [
            ...fieldsBySearch.map((field) => ({
              [field]: { contains: search },
            })),
          ],
        }
      : {};

    const { count, users } = await this.usersRepository.paginated({
      skip: offset,
      take: _limit,
      where,
      include: { avatar: true },
    });

    const last_page = Math.floor(count / _limit);
    const next_page = _page === last_page ? null : Number(_page + 1);
    const prev_page = _page === 1 ? null : _page - 1;

    const response: PaginationResponse<User> = {
      data: users,
      meta: {
        current_page: +_page,
        last_page,
        per_page: +_limit,
        total: count,
        next_page,
        prev_page,
        search: search || null,
      },
    };

    return response;
  }

  findById(id: string, options?: Omit<Prisma.UserFindUniqueArgs, 'where'>) {
    const where: Prisma.UserWhereUniqueInput = { id };

    return this.usersRepository.one(where, options);
  }

  async getById(
    id: string,
    options?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ) {
    const user = await this.findById(id, options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(
    email: string,
    options?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ) {
    const where: Prisma.UserWhereUniqueInput = { email };

    const user = await this.usersRepository.one(where, options);

    return user;
  }

  async getByEmail(
    email: string,
    options?: Omit<Prisma.UserFindUniqueArgs, 'where'>,
  ) {
    const user = await this.findByEmail(email, options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfile(
    userId: string,
    userSessionId: string,
    app_version: string | null,
    ip: string | null,
  ) {
    const user = (await this.getById(userId, {
      include: {
        sessions: true,
        own_groups: true,
        avatar: true,
        groups: true,
        markers: true,
      },
    })) as UserProfile;

    // let hasNewIp = false;
    let hasNewAppVersion = false;

    const sessions = user?.sessions.map((session) => {
      if (session.id !== userSessionId) {
        return session;
      } else {
        // const isNewAndValidIp = session.ip !== ip && ipv4Regexp.test(ip);
        // if (isNewAndValidIp) hasNewIp = true;
        if (session.app_version !== app_version) hasNewAppVersion = true;

        return {
          ...session,
          app_version,
        };
      }
    });

    if (hasNewAppVersion) {
      await this.userSessionsRepository.update(userSessionId, { app_version });
    }

    const response = { ...user, sessions };

    return response;
  }

  async create(data: CreateUserDto) {
    const user = await this.findByEmail(data.email); // check if user exist, if not throw error

    if (user) {
      throw new ConflictException('User with this email already exist');
    }

    return await this.usersRepository.create(data);
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.getById(id, { select: { id: true } }); // check if user exist, if not throw error

    return await this.usersRepository.update(id, data);
  }

  async delete(id: string) {
    await this.getById(id, { select: { id: true } }); // check if user exist, if not throw error

    return await this.usersRepository.delete(id);
  }
}

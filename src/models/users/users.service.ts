import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginationParams } from 'src/common/types';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/models/users/dto';
import { FilesService } from 'src/models/files/files.service';
import { FileTypeEnum } from 'src/models/files/enums';
import { PrismaService } from 'src/database/prisma.service';
import { paginator } from 'src/common/helpers';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
    private readonly prisma: PrismaService,
  ) {}

  async getAll() {
    return await this.usersRepository.all({
      options: {
        include: { avatar: true, groups: { select: { group: true } } },
      },
    });
  }

  async paginated(userId: string, params: PaginationParams) {
    const { limit, page, search } = params;
    const fieldsBySearch = [
      'last_name',
      'first_name',
      'middle_name',
      'email',
      'username',
    ];

    const where: Prisma.UserWhereInput = {
      id: { not: { equals: userId } },
      ...(!!search
        ? {
            AND: {
              OR: [
                ...fieldsBySearch.map((field) => ({
                  [field]: { contains: search },
                })),
              ],
            },
          }
        : {}),
    };

    const response = await paginator({ limit, page, search })(
      this.prisma.user,
      { where, include: { avatar: true } },
    );

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

  async create(data: CreateUserDto) {
    const user = await this.findByEmail(data.email, { select: { id: true } }); // check if user exist, if not throw error

    if (user) {
      throw new ConflictException('User with this email already exist');
    }

    return await this.usersRepository.create(data);
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    avatar: Express.Multer.File,
  ) {
    // check if user exist, if not throw error
    const user = (await this.getById(id, {
      select: { id: true, avatar: { select: { id: true } } },
    })) as unknown as { id: string; avatar: { id: string } };

    let userData: Prisma.UserUpdateInput = { ...data };

    return this.prisma.$transaction(async (trn) => {
      if (data.avatar === null) {
        userData = {
          ...userData,
          avatar: {
            delete: { id: user.avatar.id },
          },
        };
      } else {
        if (avatar) {
          const oldAvatars = await this.filesService.all({
            where: { user_id: id },
            options: { select: { id: true } },
          });

          if (oldAvatars.length) {
            await Promise.all(
              oldAvatars.map(
                async ({ id }) => await this.filesService.delete(id),
              ),
            );
          }
          const newAvatar = await this.filesService.create({
            file: avatar,
            entity: { id, type: FileTypeEnum.USER_AVATAR },
          });

          userData = {
            ...userData,
            avatar: {
              connect: { ...newAvatar, user_id: id, group_id: undefined },
            },
          };

          // if (user.avatar?.id) {
          //   userData = {
          //     ...userData,
          //     avatar: { ...userData.avatar, delete: { id: user.avatar.id } },
          //   };
          // }
        }
      }

      return await this.usersRepository.update(id, userData);
    });
  }

  async delete(id: string) {
    await this.getById(id, { select: { id: true } }); // check if user exist, if not throw error

    return await this.usersRepository.delete(id);
  }
}

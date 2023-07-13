import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, UpdateOptions, WhereOptions } from 'sequelize';
import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from 'src/common/constants';
import { PaginationParams } from 'src/common/types';
import { CreateUserDto, UserDto } from './dto/users.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User,
  ) {}

  async one(
    where: WhereOptions<User>,
    options?: Omit<FindOptions<User>, 'where'>,
  ): Promise<User | null> {
    return await this.usersRepository.findOne<User>({ where, ...options });
  }

  async all(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async allByPagination({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<{
    rows: User[];
    count: number;
  }> {
    return await this.usersRepository.findAndCountAll<User>({ limit, offset });
  }

  async create(user: CreateUserDto): Promise<User> {
    // eslint-disable-next-line
    // @ts-ignore
    return await this.usersRepository.create<User>(user);
  }

  async update(id: string, data: Partial<UserDto>) {
    const [, [user]] = await this.usersRepository.update<User>(data, {
      where: { id },
      returning: true,
    });
    return user;
  }

  async delete(id: string): Promise<boolean> {
    return Boolean(await this.usersRepository.destroy<User>({ where: { id } }));
  }
}

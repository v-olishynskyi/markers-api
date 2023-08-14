import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, WhereOptions } from 'sequelize';
import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from 'src/common/constants';
import { CreateUserDto, UserDto } from './dto/users.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async one(options: FindOptions<User>): Promise<User | null> {
    return await this.userModel.findOne<User>({ raw: true, ...options });
  }

  async all(): Promise<User[]> {
    return await this.userModel.findAll({
      attributes: { exclude: ['password'] },
      raw: true,
    });
  }

  async allByPagination({
    offset,
    limit,
    where,
  }: {
    offset: number;
    limit: number;
    where?: WhereOptions<User> | undefined;
  }): Promise<{
    rows: User[];
    count: number;
  }> {
    return await this.userModel.findAndCountAll<User>({
      limit,
      offset,
      where,
      attributes: { exclude: ['password'] },
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    // eslint-disable-next-line
    // @ts-ignore
    return await this.userModel.create<User>(user);
  }

  async update(id: string, data: Partial<UserDto>) {
    const [, [user]] = await this.userModel.update<User>(data, {
      where: { id },
      returning: true,
    });
    return user;
  }

  async delete(id: string): Promise<boolean> {
    return Boolean(await this.userModel.destroy<User>({ where: { id } }));
  }
}

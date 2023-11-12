import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, WhereOptions } from 'sequelize';
import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from 'src/common/constants';
import { CreateUserDto, UserDto } from './dto/users.dto';
import { PublicFile } from 'src/models/files/entities/file.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly userModel: typeof User,
  ) {}

  async one(options?: FindOptions<User>): Promise<User | null> {
    return await this.userModel.findOne<User>({
      raw: true,
      include: PublicFile,
      ...options,
    });
  }

  async all(options?: FindOptions<User>): Promise<User[]> {
    return await this.userModel.findAll({
      attributes: { exclude: ['password'] },
      include: PublicFile,
      nest: true,
      raw: true,
      ...options,
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
      include: PublicFile,
      limit,
      offset,
      where,
      attributes: { exclude: ['password'] },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create<User>(createUserDto as User);
  }

  async update(id: string, data: Partial<UserDto>) {
    const [, [user]] = await this.userModel.update<User>(data as User, {
      where: { id },
      returning: true,
    });

    return user.get({ plain: true });
  }

  async delete(id: string) {
    return Boolean(await this.userModel.destroy<User>({ where: { id } }));
  }
}

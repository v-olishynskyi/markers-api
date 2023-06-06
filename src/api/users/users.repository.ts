import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, UpdateOptions, WhereOptions } from 'sequelize';
import { CreateUserDto, UserDto } from 'src/api/users/dto/users.dto';
import { User } from 'src/entities/user/user.entity';
import { USERS_REPOSITORY } from 'src/core/constants';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User,
  ) {}

  async one(
    where: WhereOptions<User>,
    options?: Omit<FindOptions<User>, 'where'>,
  ) {
    return await this.usersRepository.findOne<User>({ where, ...options });
  }

  async all(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.usersRepository.create<User>(user);
  }

  async update(id: string, data: Partial<UserDto>) {
    console.log('file: users.repository.ts:34 - UsersRepository - where:', id);
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

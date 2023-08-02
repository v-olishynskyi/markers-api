import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
} from 'src/models/users/dto/users.dto';
import { UsersRepository } from './users.repository';
import { PaginationParams } from 'src/common/types';
import { FindOptions, WhereOptions } from 'sequelize';
import { User } from './entities/user.entity';
import { PaginationResponse } from 'src/common/helpers';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(): Promise<UserDto[]> {
    return await this.usersRepository.all();
  }

  async paginated({ limit, page, search }: PaginationParams) {
    const _page = +page;
    const _limit = +limit;
    const offset = _page * _limit;

    const where: WhereOptions<User> | undefined = !!search
      ? {
          [Op.or]: {
            last_name: { [Op.iLike]: search },
            first_name: { [Op.iLike]: search },
            // middle_name: { [Op.notILike]: search },
            // email: { [Op.notILike]: search },
            // username: { [Op.notILike]: search },
          },
        }
      : undefined;

    const { count, rows } = await this.usersRepository.allByPagination({
      limit: _limit,
      offset: offset,
      where,
    });

    const last_page = Math.floor(count / _limit);
    const next_page = _page === last_page ? null : Number(_page + 1);
    const prev_page = _page > 0 ? _page - 1 : null;

    const response: PaginationResponse<UserDto> = {
      data: rows,
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

  async findById(
    id: string,
    options?: Omit<FindOptions<User>, 'where'>,
  ): Promise<User | null> {
    const where: WhereOptions<User> = { id };
    const user = await this.usersRepository.one({ where, ...options });

    return user;
  }

  async getById(
    id: string,
    options?: Omit<FindOptions<User>, 'where'>,
  ): Promise<User> {
    const user = await this.usersRepository.one({ where: { id }, ...options });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const where: WhereOptions<User> = { email };
    const user = await this.usersRepository.one({ where });

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const where: WhereOptions<User> = { email };
    const user = await this.usersRepository.one({ where });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.findByEmail(data.email);

    if (user) {
      throw new ConflictException('User with this email already exist');
    }

    return await this.usersRepository.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}

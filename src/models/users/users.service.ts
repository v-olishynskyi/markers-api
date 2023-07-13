import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  UserDto,
  CreateUserDto,
  UpdateUserDto,
} from 'src/models/users/dto/users.dto';
import { UsersRepository } from './users.repository';
import { PaginationParams } from 'src/common/types';
import { WhereOptions } from 'sequelize';
import { User } from './entities/user.entity';
import { PaginationResponse } from 'src/common/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(): Promise<UserDto[]> {
    return await this.usersRepository.all();
  }

  async paginated({ limit, page }: PaginationParams) {
    const _page = +page;
    const _limit = +limit;
    const offset = _page * _limit;

    const { count, rows } = await this.usersRepository.allByPagination({
      limit: _limit,
      offset: offset,
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
      },
    };

    return response;
  }

  async findById(id: string): Promise<UserDto | null> {
    const where: WhereOptions<User> = { id };
    const user = await this.usersRepository.one(where);

    return user;
  }

  async getById(id: string): Promise<UserDto> {
    const where: WhereOptions<User> = { id };
    const user = await this.usersRepository.one(where);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const where: WhereOptions<User> = { email };
    const user = await this.usersRepository.one(where);

    return user;
  }

  async getByEmail(email: string): Promise<UserDto> {
    const where: WhereOptions<User> = { email };
    const user = await this.usersRepository.one(where);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const user = await this.findByEmail(data.email);

    if (user) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.CONFLICT,
      );
    }

    return await this.usersRepository.create(data);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException(
        'User with this email not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.usersRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}

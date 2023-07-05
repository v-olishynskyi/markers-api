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

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(): Promise<UserDto[]> {
    return await this.usersRepository.all();
  }

  async paginated(params: PaginationParams) {
    return await this.usersRepository.allByPagination(params);
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

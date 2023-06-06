import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/users.dto';
import { UsersRepository } from 'src/api/users/users.repository';
import { WhereOptions } from 'sequelize';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(): Promise<UserDto[]> {
    return await this.usersRepository.all();
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
    const user = await this.getById(id);

    if (!user) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.CONFLICT,
      );
    }

    return await this.usersRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}

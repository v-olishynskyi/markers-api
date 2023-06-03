import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersRepository } from 'src/api/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersRepository.getAll();
  }

  async getById(id: string): Promise<UserDto> {
    return await this.usersRepository.findOneById(id);
  }

  async getByEmail(email: string): Promise<UserDto> {
    return this.usersRepository.findOneByEmail(email);
  }
}

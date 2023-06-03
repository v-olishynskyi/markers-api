import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from 'src/api/users/dto/users.dto';
import { User } from 'src/api/users/user.entity';
import { USERS_REPOSITORY } from 'src/core/constants';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.usersRepository.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne<User>({ where: { id } });
  }

  async getAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }
}

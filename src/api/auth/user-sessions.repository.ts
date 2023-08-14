import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, UpdateOptions, WhereOptions } from 'sequelize';
import {
  CreateUserSessionDto,
  UpdateUserSessionDto,
} from 'src/api/auth/dto/user-sessions.dto';
import { UserSession } from 'src/api/auth/entities/user-sessions.entity';
import { USER_SESSIONS_REPOSITORY } from 'src/common/constants';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class UserSessionsRepository {
  constructor(
    @Inject(USER_SESSIONS_REPOSITORY)
    private readonly userSessionsModel: typeof UserSession,
  ) {}

  async one(
    where: WhereOptions<UserSession> | undefined,
    options?: Omit<FindOptions<UserSession>, 'where'>,
  ): Promise<UserSession | null> {
    return this.userSessionsModel.findOne({ where, ...options });
  }

  async create(data: CreateUserSessionDto) {
    // eslint-disable-next-line
    // @ts-ignore
    return this.userSessionsModel.create(data);
  }

  async delete(id: string) {
    return Boolean(await this.userSessionsModel.destroy({ where: { id } }));
  }

  async update(
    id: string,
    data: Partial<UpdateUserSessionDto>,
    options?: Omit<UpdateOptions<UserSession>, 'returning' | 'where'> & {
      returning: true | (keyof UserSession)[];
    },
  ) {
    return await this.userSessionsModel.update(data, {
      where: { id },
      ...options,
    });
  }
}

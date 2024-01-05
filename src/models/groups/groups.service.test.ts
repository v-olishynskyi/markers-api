import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { UsersRepository } from 'src/models/users/users.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UsersService } from 'src/models/users/users.service';

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsRepository,
        GroupsService,
        UsersRepository,
        UserSessionsRepository,
        UsersService,
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

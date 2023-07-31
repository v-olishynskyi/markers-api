import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDto } from 'src/models/users/dto/users.dto';

const users: UserDto[] = [
  {
    id: '5EC7BD8E-BA2B-1287-4909-4D18A4E5747D',
    email: 'email@email.com',
    first_name: 'Test',
    last_name: 'User',
    avatar_url: null,
    middle_name: '',
    password: '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
    username: null,
  },
  {
    id: '5EC7BD8E-BA2B-1287-3609-2D05A3E5347D',
    email: 'cursus.vestibulum@protonmail.ca',
    first_name: 'Bruno',
    last_name: 'Mercado',
    avatar_url: null,
    middle_name: 'Ramona',
    password: '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
    username: null,
  },
];

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correct auth', () => {
    // const respone = service.signIn({});
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UsersService } from 'src/models/users/users.service';
import { PrismaModule } from 'src/database/prisma.module';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;

  let getByEmailMock: jest.Mock;
  let singInMock: jest.Mock;
  let singUpMock: jest.Mock;

  beforeEach(async () => {
    getByEmailMock = jest.fn();
    singInMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        JwtService,
        UserSessionsRepository,
        {
          provide: UsersService,
          useValue: {
            getByEmail: getByEmailMock,
          },
        },
        {
          provide: AuthService,
          useValue: {
            signIn: singInMock,
            singUp: singUpMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    describe('provide incorrect data', () => {
      const user = {
        email: 'email@email.com',
        first_name: 'Test',
        last_name: 'User',
        middle_name: '',
        password:
          '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
      };

      // expect(user).toHaveProperty()
    });
  });

  // describe('signIn', () => {});

  // describe('signOut', () => {});

  it('should correct auth', () => {
    // const respone = service.signIn({});
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UsersService } from 'src/models/users/users.service';
import { PrismaModule } from 'src/database/prisma.module';
import { User } from '@prisma/client';
import { SignInDto } from 'src/api/auth/dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let userSessionsRepository: UserSessionsRepository;

  let getByEmailMock: jest.Mock;
  let signInMock: jest.Mock;
  let singUpMock: jest.Mock;

  let verifyPasswordMock: jest.Mock;
  let getTokensMock: jest.Mock;

  beforeEach(async () => {
    getByEmailMock = jest.fn();
    signInMock = jest.fn();
    verifyPasswordMock = jest.fn();
    getTokensMock = jest.fn();

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
            signIn: signInMock,
            verifyPassword: verifyPasswordMock,
            getTokens: getTokensMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userSessionsRepository = module.get<UserSessionsRepository>(
      UserSessionsRepository,
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // describe('signUp', () => {

  // });

  describe('signIn', () => {
    describe('should return accessToken and refreshToken after successfull authorization', () => {
      const signInData = {
        email: 'email@email.com',
        password: 'Qwerty1!',
      };

      const user = {
        id: '5ec7bd8e-ba2b-1287-4909-4d18a4e5747d',
        email: 'email@email.com',
        first_name: 'Test',
        last_name: 'User',
        middle_name: '',
        password:
          '$2b$12$cexIp563fGI1zgXoAA8ubegesUMjCIe21c3X4hFi3VPMeHuu1owEi',
        username: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockedTokens = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      beforeEach(() => {
        getByEmailMock.mockResolvedValue(user);
        verifyPasswordMock.mockResolvedValue(true);
        getTokensMock.mockResolvedValue(mockedTokens);
        signInMock.mockResolvedValue(mockedTokens);
      });

      it('success signIn', async () => {
        await usersService.getByEmail(signInData.email);
        expect(getByEmailMock).toBeCalledWith(signInData.email);

        const tokens = await authService.signIn(
          signInData as SignInDto,
          null,
          null,
        );
        expect(signInMock).toBeCalledWith(signInData, null, null);
        expect(tokens).toBe(mockedTokens);
      });
    });
  });

  // describe('signOut', () => {});

  it('should correct auth', () => {
    // const respone = service.signIn({});
  });
});

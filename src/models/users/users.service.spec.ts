import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UsersRepository } from 'src/models/users/users.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

  let getByEmailMock: jest.Mock;

  beforeEach(async () => {
    getByEmailMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        UserSessionsRepository,
        UsersRepository,
        {
          provide: UsersService,
          useValue: {
            getByEmail: getByEmailMock,
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('when the getByEmail method is called', () => {
    describe('and a valid email are provided ', () => {
      let user: User;

      beforeEach(async () => {
        user = {
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

        getByEmailMock.mockResolvedValue(user);
      });

      it('should return user', async () => {
        const result = await usersService.getByEmail('email@email.com');

        expect(result).toBe(user);
      });
    });

    describe('and an invalid email are provided ', () => {
      beforeEach(async () => {
        getByEmailMock.mockRejectedValue(new NotFoundException());
      });

      it('should throw NotFoundException', async () => {
        return expect(async () => {
          await usersService.getByEmail('john@smith.com');
        }).rejects.toThrow(NotFoundException);
      });
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from 'src/models/users/users.repository';
import { UserSessionsRepository } from 'src/api/auth/user-sessions.repository';
import { UpdateProfileDto } from 'src/models/profile/dto/update-profile.dto';

type UserProfile = Prisma.UserGetPayload<{
  include: {
    sessions: true;
    own_groups: true;
    avatar: true;
    groups: {
      include: {
        group: {
          include: {
            owner: { include: { avatar: true } };
            avatar: true;
            members: { select: { user: { include: { avatar: true } } } };
          };
        };
      };
    };
    markers: {
      include: { author: { include: { avatar: true } }; images: true };
    };
  };
}>;

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async getProfile(
    id: string,
    userSessionId?: string,
    app_version?: string | null,
    ip?: string | null,
  ) {
    console.log(ip);
    const where = { id };

    const user = (await this.usersRepository.one(where, {
      include: {
        sessions: true,
        own_groups: {
          include: { avatar: true, owner: { include: { avatar: true } } },
        },
        avatar: true,
        groups: {
          include: {
            group: {
              include: {
                owner: { include: { avatar: true } },
                avatar: true,
                members: { select: { user: { include: { avatar: true } } } },
              },
            },
          },
        },
        markers: {
          include: { author: { include: { avatar: true } }, images: true },
        },
      },
    })) as UserProfile;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // let hasNewIp = false;
    let hasNewAppVersion = false;

    const sessions = !userSessionId
      ? user?.sessions
      : user?.sessions.map((session) => {
          if (session.id !== userSessionId) {
            return session;
          } else {
            // const isNewAndValidIp = session.ip !== ip && ipv4Regexp.test(ip);
            // if (isNewAndValidIp) hasNewIp = true;
            if (session.app_version !== app_version) hasNewAppVersion = true;

            return {
              ...session,
              app_version,
            };
          }
        });

    if (userSessionId && hasNewAppVersion) {
      await this.userSessionsRepository.update(userSessionId, { app_version });
    }

    const groups = user.groups.map((groupAssociativeEntity) => {
      return {
        ...groupAssociativeEntity.group,
        members: groupAssociativeEntity.group.members.map(
          (memberAssociativeEntity) => memberAssociativeEntity.user,
        ),
      };
    });

    const response = { ...user, groups, sessions };

    return response;
  }

  async updateProfile(id: string, body: UpdateProfileDto) {
    return this.usersRepository.update(id, body);
  }
}

import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/models/users/entities/user.entity';
import { Marker } from 'src/models/markers/entities/marker.entity';
import { PublicFile } from 'src/models/files/entities/file.entity';
import databaseConfig from 'src/configs/database/postgres';
import { SEQUELIZE, DEV, PROD, TEST } from 'src/common/constants';
import { UserSession } from 'src/api/auth/entities/user-sessions.entity';
import { Group } from 'src/models/groups/entities/group.entity';
import { GroupUsers } from 'src/models/groups/entities/group-users.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEV:
          config = databaseConfig[DEV];
          break;
        case TEST:
          config = databaseConfig[TEST];
          break;
        case PROD:
          config = databaseConfig[PROD];
          break;
        default:
          config = databaseConfig[DEV];
      }
      const sequelize = new Sequelize({
        ...config,
        timezone: '+00:00',
      });
      sequelize.addModels([
        User,
        Marker,
        UserSession,
        PublicFile,
        Group,
        GroupUsers,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

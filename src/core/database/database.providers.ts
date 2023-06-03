import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from 'src/configs/database.config';
import { SEQUELIZE, DEV, PROD, TEST } from 'src/core/constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEV:
          config = databaseConfig.dev;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PROD:
          config = databaseConfig.prod;
          break;
        default:
          config = databaseConfig.dev;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

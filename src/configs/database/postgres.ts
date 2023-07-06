require('dotenv').config();

import { DEV, PROD, TEST } from 'src/common/constants';
import { IDatabaseConfig } from 'src/common/types';

export default {
  [DEV]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  [TEST]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  [PROD]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
} as IDatabaseConfig;

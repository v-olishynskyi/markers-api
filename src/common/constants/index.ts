export const SEQUELIZE = 'SEQUELIZE';
export const DEV = 'development';
export const TEST = 'test';
export const PROD = 'production';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';
export const GROUPS_REPOSITORY = 'GROUPS_REPOSITORY';
export const USER_SESSIONS_REPOSITORY = 'USER_SESSIONS_REPOSITORY';
export const MARKERS_REPOSITORY = 'MARKERS_REPOSITORY';
export const PUBLIC_FILE_REPOSITORY = 'PUBLIC_FILE_REPOSITORY';

export const ACCESS_TOKEN_EXPIRED_SEC = 1000 * 60 * 60; // 1h

export const ipv4Regexp =
  /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;

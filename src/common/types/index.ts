import { DEV, PROD, TEST } from 'src/common/constants';

export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
}

export interface IDatabaseConfig {
  [DEV]: IDatabaseConfigAttributes;
  [TEST]: IDatabaseConfigAttributes;
  [PROD]: IDatabaseConfigAttributes;
}

export type PaginationParams = {
  page: number;
  limit: number;
  search?: string | null;
};

// export type PaginatedResponse<TData = any> = {
//   data: TData[];
//   page: number;
//   limit: number;
//   total: number;
// };

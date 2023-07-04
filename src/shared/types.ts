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
  dev: IDatabaseConfigAttributes;
  test: IDatabaseConfigAttributes;
  prod: IDatabaseConfigAttributes;
}

export type PaginationParams = {
  offset: number;
  limit: number;
};

export type PaginatedResponse<TData = any> = {
  data: TData[];
  page: number;
  limit: number;
  total: number;
};

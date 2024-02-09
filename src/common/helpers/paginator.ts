import { PaginationResponse } from 'src/common/shared/dto';

export type DefaultPaginateOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

export const paginator =
  <TData>(defaultOptions: DefaultPaginateOptions) =>
  async (model: any, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.limit || defaultOptions?.limit) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;

    const dataQuery = model.findMany({
      skip,
      take: perPage,
      ...options,
    });

    const countQuery = model.count({
      where: options.where,
    });

    const [count, data] = await Promise.all([countQuery, dataQuery]);

    const last_page = Math.ceil(count / perPage);
    const next_page = page < last_page ? page + 1 : null;
    const prev_page = page > 1 ? page - 1 : null;

    const response: PaginationResponse<TData> = {
      data,
      meta: {
        current_page: page,
        last_page,
        per_page: perPage,
        total: count,
        next_page,
        prev_page,
        search: defaultOptions.search || null,
      },
    };

    return response;
  };

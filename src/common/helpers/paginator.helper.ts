import { Marker } from 'src/models/markers/entities/marker.entity';
import { User } from 'src/models/users/entities/user.entity';
import { Model } from 'sequelize-typescript';
import { PaginationResponse } from 'src/common/helpers/responses/paginations';

export default async function paginator<TResponse>(
  repository,
  _page: number,
  _limit: number,
) {
  const page = +_page;
  const limit = +_limit;
  const offset = _page * _limit;

  const { count, rows } = await repository.findAndCountAll({
    limit,
    offset,
  });

  const last_page = Math.floor(count / _limit);
  const next_page = page === last_page ? null : Number(page + 1);
  const prev_page = page > 0 ? page - 1 : null;

  const response: PaginationResponse<TResponse> = {
    data: rows,
    meta: {
      current_page: +_page,
      last_page,
      per_page: +_limit,
      total: count,
      next_page,
      prev_page,
    },
  };

  return response;
}

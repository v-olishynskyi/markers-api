import { Marker } from 'src/models/markers/entities/marker.entity';
import { User } from 'src/models/users/entities/user.entity';
import { Model } from 'sequelize-typescript';
import { PaginationResponse } from 'src/common/helpers/responses/paginations';
import { FindAndCountOptions } from 'sequelize';

// export default async function paginator(
//   repository,
//   _page: number,
//   _limit: number,
// ) {
//   const page = +_page;
//   const limit = +_limit;
//   const offset = _page * _limit;

// const { count, rows } = await repository.findAndCountAll({
//   limit,
//   offset,
// });

// const last_page = Math.floor(count / _limit);
// const next_page = page === last_page ? null : Number(page + 1);
// const prev_page = page > 0 ? page - 1 : null;

// const response: PaginationResponse<TResponse> = {
//   data: rows,
//   meta: {
//     current_page: +_page,
//     last_page,
//     per_page: +_limit,
//     total: count,
//     next_page,
//     prev_page,
//     search: '',
//   },
// };

// return response;
// }

export class Paginator<TResponse, TRepository> {
  private _repository;

  constructor(repository) {
    this._repository = repository;
  }

  private async get(
    page: number,
    limit: number,
    options?: Omit<FindAndCountOptions<TRepository>, 'group'>,
  ) {
    const _page = +page;
    const _limit = +limit;
    const _offset = +_page * +_limit;

    const { count, rows } = await this._repository.findAndCountAll({
      limit: _limit,
      offset: _offset,
      ...options,
    });

    const last_page = Math.floor(count / _limit);
    const next_page = _page === last_page ? null : Number(_page + 1);
    const prev_page = _page > 0 ? _page - 1 : null;

    const response = {
      data: rows,
      meta: {
        current_page: +_page,
        last_page,
        per_page: +_limit,
        total: count,
        next_page,
        prev_page,
        search: '',
      },
    };

    return response;
  }
}

import { SortByDirections } from 'src/common/shared/enums';
import { PaginationParams } from 'src/common/types';

export enum MarkersFilterBy {
  All = 'all',
  My_Markers = 'my_markers',
  By_User = 'by_user',
}

export enum MarkersSortBy {
  Name = 'name',
  UpdatedAt = 'updated_at',
  CreatedAt = 'created_at',
}

export type GetMarkersRequestParams = {
  filter_by: MarkersFilterBy;
  sort_by: MarkersSortBy;
  direction: SortByDirections;
} & PaginationParams;

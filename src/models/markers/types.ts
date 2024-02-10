import { PaginationParams } from 'src/common/types';

export enum MarkersFilterBy {
  All = 'all',
  My_Markers = 'my_markers',
  By_User = 'by_user',
}

export type GetMarkersRequestParams = {
  filter_by: MarkersFilterBy;
} & PaginationParams;

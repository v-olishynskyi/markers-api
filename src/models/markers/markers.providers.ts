import { MARKERS_REPOSITORY } from 'src/common/constants';
import { Marker } from 'src/models/markers/entities/marker.entity';

export const markersProviders = [
  {
    provide: MARKERS_REPOSITORY,
    useValue: Marker,
  },
];

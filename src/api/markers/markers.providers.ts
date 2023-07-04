import { MARKERS_REPOSITORY } from 'src/core/constants';
import { Marker } from 'src/entities/marker/marker.entity';

export const markersProviders = [
  {
    provide: MARKERS_REPOSITORY,
    useValue: Marker,
  },
];

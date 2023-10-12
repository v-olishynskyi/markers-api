import { Inject, Injectable } from '@nestjs/common';
import { MARKERS_REPOSITORY } from 'src/common/constants';
import { Marker } from './entities/marker.entity';
import {
  CreateMarkerDto,
  UpdateMarkerDto,
} from 'src/models/markers/dto/markers.dto';
import { FindOptions } from 'sequelize';

@Injectable()
export class MarkersRepository {
  constructor(
    @Inject(MARKERS_REPOSITORY) private readonly markerModel: typeof Marker,
  ) {}

  async all(options?: FindOptions<Marker>): Promise<Marker[]> {
    return await this.markerModel.findAll<Marker>({ raw: true, ...options });
  }

  async one(options: FindOptions<Marker>): Promise<Marker | null> {
    return await this.markerModel.findOne<Marker>({ raw: true, ...options });
  }

  async create(createMarkerDto: CreateMarkerDto): Promise<Marker> {
    // eslint-disable-next-line
    // @ts-ignore
    return await this.markerModel.create({
      ...createMarkerDto,
      latitude: +createMarkerDto.latitude,
      longitude: +createMarkerDto.longitude,
    });
  }

  async update(id: string, updateMarkerDto: Partial<UpdateMarkerDto>) {
    const [, [marker]] = await this.markerModel.update<Marker>(
      updateMarkerDto,
      {
        where: { id },
        returning: true,
      },
    );
    return marker.get({ plain: true });
  }

  async delete(id: string) {
    return Boolean(await this.markerModel.destroy<Marker>({ where: { id } }));
  }
}

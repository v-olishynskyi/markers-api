import { Injectable, NotFoundException } from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import {
  CreateMarkerDto,
  UpdateMarkerDto,
} from 'src/models/markers/dto/markers.dto';
import { FindOptions, WhereOptions } from 'sequelize';
import { Marker } from 'src/models/markers/entities/marker.entity';
import { FilesService } from 'src/models/files/files.service';

@Injectable()
export class MarkersService {
  constructor(
    private readonly markersRepository: MarkersRepository,
    private readonly publicFileService: FilesService,
  ) {}

  async findById(
    id: string,
    options?: Omit<FindOptions<Marker>, 'where'>,
  ): Promise<Marker | null> {
    const where: WhereOptions<Marker> = { id };
    const marker = await this.markersRepository.one({
      where,
      ...options,
    });

    return marker;
  }

  async getById(
    id: string,
    options?: Omit<FindOptions<Marker>, 'where'>,
  ): Promise<Marker> {
    const where: WhereOptions<Marker> = { id };
    const marker = await this.markersRepository.one({
      where,
      ...options,
    });

    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    return marker;
  }

  async getAllMarkers() {
    const markers = await this.markersRepository.all();

    const markersData = markers.map((markerEntity) => {
      const marker = markerEntity.get({ plain: true });

      return marker;
    });

    return markersData;
  }

  async create(data: CreateMarkerDto): Promise<Marker> {
    const images = data?.images;

    const createdMarker = await this.markersRepository.create({
      ...data,
      latitude: +data.latitude,
      longitude: +data.longitude,
    });

    const updateFilesPromises = images?.map(
      async (id) =>
        await this.publicFileService.update(id, {
          marker_id: createdMarker.id,
        }),
    );

    updateFilesPromises && (await Promise.all(updateFilesPromises));

    const marker = await this.getById(createdMarker.id);

    return marker;
  }

  async update(id: string, data: UpdateMarkerDto) {
    const sourceMarkerInstance = await this.getById(id);
    const sourceMarker = sourceMarkerInstance.get({ plain: true });
  }

  async delete(id: string) {
    return await this.markersRepository.delete(id);
  }
}

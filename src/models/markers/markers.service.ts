import { Injectable, NotFoundException } from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import { CreateMarkerDto } from 'src/models/markers/dto/markers.dto';
import { FindOptions, WhereOptions } from 'sequelize';
import { Marker } from 'src/models/markers/entities/marker.entity';
import { FilesService } from 'src/models/files/files.service';

@Injectable()
export class MarkersService {
  constructor(
    private readonly markersRepository: MarkersRepository,
    private readonly publicFileService: FilesService,
  ) {}

  async getAllMarkers() {
    const markers = await this.markersRepository.all();

    const markersData = markers.map((markerEntity) => {
      const marker = markerEntity.get({ plain: true });

      return marker;
    });

    return markersData;
  }

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

  async createMarker(dto: CreateMarkerDto) {
    const images = dto?.images;

    const createdMarker = await this.markersRepository.create({
      ...dto,
      latitude: +dto.latitude,
      longitude: +dto.longitude,
    });

    const updateFilesPromises = images?.map(
      async (id) =>
        await this.publicFileService.updatePublicFile(id, {
          marker_id: createdMarker.id,
        }),
    );

    updateFilesPromises && (await Promise.all(updateFilesPromises));

    const marker = await this.getById(createdMarker.id);

    return marker;
  }
}

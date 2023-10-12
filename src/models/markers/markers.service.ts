import { Injectable, NotFoundException } from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import { CreateMarkerDto } from 'src/models/markers/dto/markers.dto';
import { FindOptions, WhereOptions } from 'sequelize';
import { Marker } from 'src/models/markers/entities/marker.entity';

@Injectable()
export class MarkersService {
  constructor(private readonly markersRepository: MarkersRepository) {}

  async getAllMarkers() {
    return this.markersRepository.all();
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
    return await this.markersRepository.create({
      ...dto,
      images: dto.images.map(({ id }) => id),
      latitude: +dto.latitude,
      longitude: +dto.longitude,
    });
  }
}

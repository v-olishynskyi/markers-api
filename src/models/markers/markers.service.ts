import { Injectable, NotFoundException } from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import { FilesService } from 'src/models/files/files.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarkersService {
  constructor(
    private readonly markersRepository: MarkersRepository,
    private readonly publicFileService: FilesService,
  ) {}

  async getAll() {
    return await this.markersRepository.all({
      options: { include: { author: true, images: true } },
    });
  }

  async findById(id: string, include?: Prisma.MarkerInclude) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    const marker = await this.markersRepository.one(where, include);

    return marker;
  }

  async getById(id: string, include?: Prisma.MarkerInclude) {
    const marker = await this.findById(id, include);

    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    return marker;
  }

  async create(data: Prisma.MarkerCreateInput) {
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

  async update(id: string, data: Prisma.MarkerUpdateInput) {
    const sourceMarker = await this.getById(id, { images: true });

    const sourceMarkerImagesIds = sourceMarker.images.map(({ id }) => id);
    const updatingMarkerImagesIds = data.images;

    const updatedMarker = await this.markersRepository.update(id, data);

    // check if user add new image to marker
    const newImages = updatingMarkerImagesIds.filter(
      (el) => !sourceMarkerImagesIds.includes(el),
    );

    if (newImages.length) {
      // link new images with updated marker
      await Promise.all(
        newImages.map(
          async (imgId) =>
            await this.publicFileService.update(imgId, { marker_id: id }),
        ),
      );
    }

    // check if user remove images from marker
    const deletedImages = sourceMarkerImagesIds.filter(
      (el) => !updatingMarkerImagesIds.includes(el),
    );

    if (deletedImages.length) {
      // delete unsued image from db
      await Promise.all(
        deletedImages.map(
          async (imgId) => await this.publicFileService.delete(imgId),
        ),
      );
    }

    return updatedMarker;
  }

  async delete(id: string) {
    await this.getById(id);

    return await this.markersRepository.delete(id);
  }
}

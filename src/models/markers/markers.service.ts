import { Injectable, NotFoundException } from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import { FilesService } from 'src/models/files/files.service';
import { Marker, Prisma } from '@prisma/client';
import { CreateMarkerDto, UpdateMarkerDto } from 'src/models/markers/dto';
import { UsersService } from 'src/models/users/users.service';
import { PaginationParams } from 'src/common/types';
import { PaginationResponse } from 'src/common/helpers';

type MarkerWithSelectedImages = Prisma.MarkerGetPayload<{
  select: { images: true };
}>;

@Injectable()
export class MarkersService {
  constructor(
    private readonly markersRepository: MarkersRepository,
    private readonly publicFileService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  async getAll() {
    return await this.markersRepository.all({
      options: { include: { author: true, images: true } },
    });
  }

  async paginated({ limit, page, search }: PaginationParams) {
    const _page = +page === 0 ? 1 : +page;
    const _limit = +limit;
    const offset = _page * _limit;

    const fieldsBySearch = ['name'];

    const where: Prisma.MarkerWhereInput = !!search
      ? {
          OR: [
            ...fieldsBySearch.map((field) => ({
              [field]: { contains: search },
            })),
          ],
        }
      : {};

    const { count, markers } = await this.markersRepository.paginated({
      skip: offset,
      take: _limit,
      where,
      include: { author: true, images: true },
    });

    const last_page = Math.floor(count / _limit);
    const next_page = _page === last_page ? null : Number(_page + 1);
    const prev_page = _page === 1 ? null : _page - 1;

    const response: PaginationResponse<Marker> = {
      data: markers,
      meta: {
        current_page: +_page,
        last_page,
        per_page: +_limit,
        total: count,
        next_page,
        prev_page,
        search: search || null,
      },
    };

    return response;
  }

  async findById(
    id: string,
    options?: Omit<Prisma.MarkerFindUniqueArgs, 'where'>,
  ) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    const marker = await this.markersRepository.one(where, options);

    return marker;
  }

  async getById(
    id: string,
    options?: Omit<Prisma.MarkerFindUniqueArgs, 'where'>,
  ) {
    const marker = await this.findById(id, options);

    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    return marker;
  }

  async create(data: CreateMarkerDto) {
    const images = data?.images;

    const author = await this.usersService.getById(data.author_id);

    const createdMarker = await this.markersRepository.create({
      ...data,
      latitude: +data.latitude,
      longitude: +data.longitude,
      author: { connect: author },
      images: undefined,
    });

    const updateFilesPromises = images?.map(
      async (id) =>
        await this.publicFileService.update(id, {
          marker_id: createdMarker.id,
        }),
    );

    updateFilesPromises?.length && (await Promise.all(updateFilesPromises));

    const marker = await this.getById(createdMarker.id);

    return marker;
  }

  async update(id: string, data: UpdateMarkerDto) {
    const sourceMarker = (await this.getById(id, {
      select: {
        images: true,
      },
    })) as unknown as MarkerWithSelectedImages;

    const sourceMarkerImagesIds = sourceMarker.images.map(({ id }) => id);
    const updatingMarkerImagesIds = data.images;

    // check if user add new image to marker
    const newImages = updatingMarkerImagesIds.filter(
      (el) => !sourceMarkerImagesIds.includes(el),
    );

    // check if user remove images from marker
    const deletedImages = sourceMarkerImagesIds.filter(
      (el) => !updatingMarkerImagesIds.includes(el),
    );

    const updatedMarker = await this.markersRepository.update(id, {
      ...data,
      images: {},
    });

    if (newImages.length) {
      // link new images with updated marker
      await Promise.all(
        newImages.map(
          async (imgId) =>
            await this.publicFileService.update(imgId, { marker_id: id }),
        ),
      );
    }

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
    await this.getById(id, { select: { id: true } }); // check if marker exist, if not throw error

    return await this.markersRepository.delete(id);
  }
}

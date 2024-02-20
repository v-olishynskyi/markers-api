import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MarkersRepository } from './markers.repository';
import { FilesService } from 'src/models/files/files.service';
import { Prisma } from '@prisma/client';
import { CreateMarkerDto, UpdateMarkerDto } from 'src/models/markers/dto';
import { UsersService } from 'src/models/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { FileTypeEnum } from 'src/models/files/enums';
import { paginator } from 'src/common/helpers';
import { GetMarkersRequestParams, MarkersFilterBy } from './types';

type MarkerWithSelectedImages = Prisma.MarkerGetPayload<{
  select: { images: true };
}>;

const fieldsBySearch = ['name'];

const markerInclude: Prisma.MarkerInclude = {
  author: {
    include: { avatar: true },
  },
  images: true,
};

@Injectable()
export class MarkersService {
  constructor(
    private readonly markersRepository: MarkersRepository,
    private readonly publicFileService: FilesService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async getAll(
    userId: string,
    params: Omit<GetMarkersRequestParams, 'limit' | 'page'>,
  ) {
    const { filter_by = MarkersFilterBy.All, search } = params;

    let where: Prisma.MarkerWhereInput = {};

    if (search) {
      where = {
        OR: [
          ...fieldsBySearch.map((field) => ({
            [field]: { contains: search },
          })),
        ],
      };
    }

    if (
      filter_by === MarkersFilterBy.My_Markers ||
      filter_by === MarkersFilterBy.By_User
    ) {
      where = { ...where, AND: { author_id: { equals: userId } } };
    }

    return await this.markersRepository.all({
      where,
      options: { include: markerInclude },
    });
  }

  async paginated(userId: string, params: Required<GetMarkersRequestParams>) {
    const { limit, page, search, filter_by } = params;

    let where: Prisma.MarkerWhereInput = {};

    if (search) {
      where = {
        OR: [
          ...fieldsBySearch.map((field) => ({
            [field]: { contains: search },
          })),
        ],
      };
    }

    if (
      filter_by === MarkersFilterBy.My_Markers ||
      filter_by === MarkersFilterBy.By_User
    ) {
      where = { ...where, AND: { author_id: { equals: userId } } };
    }

    const response = await paginator({ page, limit, search })(
      this.prisma.marker,
      { where, include: markerInclude },
    );

    return response;
  }

  async findById(
    id: string,
    options: Omit<Prisma.MarkerFindUniqueArgs, 'where'> = {
      include: markerInclude,
    },
  ) {
    const where: Prisma.MarkerWhereUniqueInput = { id };

    const marker = await this.markersRepository.one(where, options);

    return marker;
  }

  async getById(
    id: string,
    options: Omit<Prisma.MarkerFindUniqueArgs, 'where'> = {
      include: markerInclude,
    },
  ) {
    const marker = await this.findById(id, options);

    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    return marker;
  }

  async create(data: CreateMarkerDto, images: Array<Express.Multer.File>) {
    const author = await this.usersService.getById(data.author_id);

    if (data.description && data.description?.length > 255) {
      throw new BadRequestException('Description is too long');
    }

    return this.prisma.$transaction(
      async () => {
        const markerData: Prisma.MarkerCreateInput = {
          name: data.name,
          description: data.description,
          is_draft: data.is_draft,
          is_hidden: data.is_hidden,
          latitude: +data.latitude,
          longitude: +data.longitude,
          author: { connect: author },
          images: undefined,
        };

        const createdMarker = await this.markersRepository.create(markerData);

        const imagesPromises = images.map(
          async (file) =>
            await this.publicFileService.create({
              file,
              entity: { id: createdMarker.id, type: FileTypeEnum.MARKER_IMAGE },
            }),
        );

        await Promise.all(imagesPromises);

        const marker = await this.getById(createdMarker.id);

        return marker;
      },
      { maxWait: 1000 * 30 },
    );
  }

  async update(
    id: string,
    data: UpdateMarkerDto,
    newImages: Array<Express.Multer.File>,
  ) {
    const sourceMarker = (await this.getById(id, {
      select: {
        images: true,
      },
    })) as unknown as MarkerWithSelectedImages;
    const sourceMarkerImagesId = sourceMarker.images.map(({ id }) => id);
    const updatingMarkerImagesIds = data.images;
    const deletedImages = sourceMarkerImagesId.filter(
      (el) => !updatingMarkerImagesIds.includes(el),
    );
    await this.markersRepository.update(id, {
      ...data,
      images: {},
    });
    if (deletedImages.length) {
      // delete unused image from db
      await Promise.all(
        deletedImages.map(
          async (imgId) => await this.publicFileService.delete(imgId),
        ),
      );
    }

    if (newImages.length) {
      await Promise.all(
        newImages.map(
          async (image) =>
            await this.publicFileService.create({
              file: image,
              entity: { id: id, type: FileTypeEnum.MARKER_IMAGE },
            }),
        ),
      );
    }

    const updatedMarker = await this.getById(id);

    return updatedMarker;
  }

  async delete(id: string) {
    const marker = (await this.getById(id, {
      select: { id: true, images: { select: { id: true } } },
    })) as unknown as Prisma.MarkerGetPayload<{
      select: { id: true; images: { select: { id: true } } };
    }>; // check if marker exist, if not throw error

    const imagesThatShouldBeDeleted = marker.images.map(({ id }) => id);

    await this.publicFileService.deleteMany(imagesThatShouldBeDeleted);
    return await this.markersRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PublicFile } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { CreateFileDto } from 'src/models/files/dto';
import { FileBodyDto, UpdateFileDto } from 'src/models/files/dto';
import { FileTypeEnum } from 'src/models/files/enums';
import { FilesRepository } from 'src/models/files/files.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly publicFileRepository: FilesRepository,
  ) {}

  all(
    params: {
      where?: Prisma.PublicFileWhereInput;
      options?: Omit<Prisma.PublicFileFindManyArgs, 'where'>;
    } = {},
  ) {
    return this.publicFileRepository.all(params);
  }

  findById(
    id: string,
    options?: Omit<Prisma.PublicFileFindUniqueArgs, 'where'>,
  ): Promise<PublicFile | null> {
    const where: Prisma.PublicFileWhereUniqueInput = { id };

    return this.publicFileRepository.one(where, options);
  }

  async getById(
    id: string,
    options?: Omit<Prisma.PublicFileFindUniqueArgs, 'where'>,
  ): Promise<PublicFile> {
    const file = await this.findById(id, options);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async create(data: CreateFileDto) {
    const { entity, file } = data;

    const s3 = new S3();

    const key = `${entity.type}-${uuid()}`;

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') as string,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read-write',
      })
      .promise();

    const entityData = {
      user_id: undefined,
      marker_id: undefined,
      group_id: undefined,
      [`${entity.type}_id`]: entity.id,
    };

    const response = await this.publicFileRepository.create({
      key,
      url: uploadResult.Location,
      ...entityData,
    });

    return response;
  }

  async update(id: string, data: UpdateFileDto) {
    return await this.publicFileRepository.update(id, data);
  }

  async delete(id: string) {
    const s3 = new S3();

    await this.getById(id);

    await this.publicFileRepository.delete(id);
  }

  async deleteMany(ids: string[]) {
    const deletePromise = ids.map(
      async (id) => await this.publicFileRepository.delete(id),
    );
    await Promise.all(deletePromise);
  }
}

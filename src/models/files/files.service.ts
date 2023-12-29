import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PublicFile } from '@prisma/client';
import { S3 } from 'aws-sdk';
import {
  FileBodyDto,
  UpdateFileDto,
} from 'src/models/files/dto/public-file.dto';
import { FileTypeEnum } from 'src/models/files/enums';
import { PublicFileRepository } from 'src/models/files/files.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly publicFileRepository: PublicFileRepository,
  ) {}

  async findById(id: string): Promise<PublicFile | null> {
    const where: Prisma.PublicFileWhereUniqueInput = { id };
    const publicFile = await this.publicFileRepository.one(where);

    return publicFile;
  }

  async getById(id: string): Promise<PublicFile> {
    const file = await this.findById(id);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async create(
    buffer: Buffer,
    body: Prisma.PublicFileCreateInput & FileBodyDto,
  ) {
    const s3 = new S3();

    const key = `${uuid()}`;

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') as string,
        Key: key,
        Body: buffer,
        ACL: 'public-read-write',
      })
      .promise();

    const isMarkerImage = body.entity_type === FileTypeEnum.MARKER_IMAGE;

    const entityData = isMarkerImage
      ? { marker_id: body.entity_id, user_id: null }
      : { user_id: body.entity_id, marker_id: null };

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
}

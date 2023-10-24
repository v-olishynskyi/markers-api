import { Inject, Injectable } from '@nestjs/common';
import { PUBLIC_FILE_REPOSITORY } from 'src/common/constants';
import {
  CreateFileDto,
  UpdateFileDto,
} from 'src/models/files/dto/public-file.dto';
import { FindOptions } from 'sequelize';
import { PublicFile } from 'src/models/files/entities/file.entity';

@Injectable()
export class PublicFileRepository {
  constructor(
    @Inject(PUBLIC_FILE_REPOSITORY)
    private readonly publicFileModel: typeof PublicFile,
  ) {}

  async one(options: FindOptions<PublicFile>): Promise<PublicFile | null> {
    return await this.publicFileModel.findOne<PublicFile>({
      raw: true,
      ...options,
    });
  }

  async create(createFileDto: CreateFileDto): Promise<PublicFile> {
    return await this.publicFileModel.create(createFileDto as PublicFile);
  }

  async delete(id: string) {
    return Boolean(
      await this.publicFileModel.destroy<PublicFile>({ where: { id } }),
    );
  }

  async update(id: string, data: UpdateFileDto) {
    const [, [file]] = await this.publicFileModel.update<PublicFile>(
      data as PublicFile,
      {
        where: { id },
        returning: true,
      },
    );

    return file;
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PublicFileRepository } from 'src/models/files/file.repository';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly publicFileRepository: PublicFileRepository,
  ) {}

  async uploadPublicFile(buffer: Buffer) {
    const s3 = new S3();

    const key = `${uuid()}`;

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME') as string,
        Key: key,
        Body: buffer,
      })
      .promise();

    const response = await this.publicFileRepository.create({
      key,
      url: uploadResult.Location,
    });

    return response;
  }
}

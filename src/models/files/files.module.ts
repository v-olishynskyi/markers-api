import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { publicFileProviders } from 'src/models/files/files.providers';
import { PublicFileRepository } from 'src/models/files/files.repository';

@Module({
  providers: [FilesService, PublicFileRepository, ...publicFileProviders],
  controllers: [FilesController],
})
export class FilesModule {}

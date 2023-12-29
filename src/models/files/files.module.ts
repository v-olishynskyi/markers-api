import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PublicFileRepository } from 'src/models/files/files.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [PublicFileRepository, FilesService],
  exports: [FilesService],
})
export class FilesModule {}

import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { Prisma } from '@prisma/client';
import { FileBodyDto } from 'src/models/files/dto/public-file.dto';
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Prisma.PublicFileCreateInput & FileBodyDto,
  ) {
    try {
      const response = await this.filesService.create(file.buffer, body);

      return response;
    } catch (error) {
      throw new HttpException('Error when upload file', 500);
    }
  }

  @ApiOperation({
    summary: 'Get file by id',
  })
  // @ApiOkResponse({ type: PublicFile })
  @Get('/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.filesService.getById(id);
  }
}

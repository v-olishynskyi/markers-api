import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import {
  CreateFileDto,
  FileBodyDto,
  PublicFileDto,
} from 'src/models/files/dto';
import { FormDataToBodyInterceptor } from 'src/common/decorators';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({
    summary: 'Gell all files',
  })
  @ApiOkResponse({ type: [PublicFileDto] })
  @Get('/all')
  getAll() {
    return this.filesService.all();
  }

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
  @UseInterceptors(
    FileInterceptor('file'),
    FormDataToBodyInterceptor([{ fieldName: 'type', extractToBody: true }]),
  )
  @ApiCreatedResponse({ type: PublicFileDto })
  @Post('upload')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const response = await this.filesService.create({
      file,
      entity: body,
    });

    return response;
  }

  @ApiOperation({
    summary: 'Get file by id',
  })
  @ApiOkResponse({ type: PublicFileDto })
  @Get('/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.filesService.getById(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/api/auth/auth.guard';
import {
  CreateMarkerDto,
  MarkerDto,
  UpdateMarkerDto,
} from 'src/models/markers/dto';
import {
  ApiPaginationResponse,
  FormDataToBodyInterceptor,
} from 'src/common/decorators';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MarkersFilterBy } from './types';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @ApiOperation({ summary: 'Get markers', description: 'Get all user markers' })
  @ApiOkResponse({ type: [MarkerDto] })
  @ApiQuery({ name: 'user_id', required: true, type: String })
  @Get('/markers-by-user')
  async getAllByUser(
    @Query('user_id') user_id: string,
    @Req() request: Request,
  ) {
    const params = request['query'];

    const markers = await this.markersService.getAll(user_id, {
      ...params,
      filter_by: MarkersFilterBy.By_User,
    });
    return markers;
  }

  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  @ApiOkResponse({ type: [MarkerDto] })
  @Get('/get-all')
  getAll(@Req() request: Request) {
    const userId = request['userId'];
    const params = request['query'];

    return this.markersService.getAll(userId, params);
  }

  @ApiOperation({ summary: 'Get all markers with pagination' })
  @ApiPaginationResponse(MarkerDto)
  @ApiQuery({ name: 'filter_by', required: false, enum: MarkersFilterBy })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('/')
  getMarkerWithPagination(@Req() request: Request) {
    const userId = request['userId'];
    const params = request['query'];

    return this.markersService.paginated(userId, params);
  }

  @ApiOperation({
    summary: 'Get marker',
    description: 'Get one marker by id',
  })
  @ApiOkResponse({ type: MarkerDto })
  @Get('/:id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.markersService.findById(id);
  }

  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  @ApiCreatedResponse({ type: MarkerDto })
  @UseInterceptors(
    FilesInterceptor('images'),
    FormDataToBodyInterceptor([{ fieldName: 'marker', extractToBody: true }]),
  )
  @Post('/')
  createMarker(
    @Body() body: CreateMarkerDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.markersService.create(body, files);
  }

  @ApiOperation({
    summary: 'Update marker',
    description: 'Update marker by id',
  })
  @ApiOkResponse({ type: MarkerDto })
  @UseInterceptors(
    FilesInterceptor('images'),
    FormDataToBodyInterceptor([{ fieldName: 'marker', extractToBody: true }]),
  )
  @Put('/:id')
  updateMarker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateMarkerDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.markersService.update(id, body, files);
  }

  @ApiOperation({
    summary: 'Delete marker',
    description: 'Delete marker by id',
  })
  @ApiOkResponse()
  @Delete('/:id')
  async deleteMarker(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.markersService.delete(id);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Marker successfuly deleted' })
      .send();
  }
}

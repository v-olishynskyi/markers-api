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
  Res,
  UseGuards,
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
import { ApiPaginationResponse } from 'src/common/decorators';
import { Response } from 'express';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  @ApiOkResponse({ type: [MarkerDto] })
  @Get('/all')
  async getAll() {
    return await this.markersService.getAll();
  }

  @ApiOperation({ summary: 'Get all markers with pagination' })
  @ApiPaginationResponse(MarkerDto)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('/paginated')
  async getMarkerWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string | null,
  ) {
    return await this.markersService.paginated({
      page,
      limit,
      search: search,
    });
  }

  @ApiOperation({
    summary: 'Get marker',
    description: 'Get one marker by id',
  })
  @ApiOkResponse({ type: MarkerDto })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.markersService.findById(id, {
      include: { author: true, images: true },
    });
  }

  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  @ApiCreatedResponse({ type: MarkerDto })
  @Post('/')
  async createMarker(@Body() body: CreateMarkerDto) {
    return this.markersService.create(body);
  }

  @ApiOperation({
    summary: 'Update marker',
    description: 'Update marker by id',
  })
  @ApiOkResponse({ type: MarkerDto })
  @Put('/:id')
  async updateMarker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateMarkerDto,
  ) {
    return this.markersService.update(id, body);
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

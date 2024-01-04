import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MarkersService } from './markers.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/api/auth/auth.guard';
import {
  CreateMarkerDto,
  MarkerDto,
  UpdateMarkerDto,
} from 'src/models/markers/dto';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  @ApiOkResponse({ type: [MarkerDto] })
  @Get('/')
  async getAll() {
    return await this.markersService.getAll();
  }

  @ApiOperation({
    summary: 'Get marker',
    description: 'Get one marker by id',
  })
  @ApiOkResponse({ type: MarkerDto })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.markersService.getById(id, {
      include: { author: true, images: true },
    });
  }

  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  @ApiCreatedResponse({ type: MarkerDto })
  @Post('/')
  async createMarker(@Body() body: CreateMarkerDto) {
    return await this.markersService.create(body);
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
    return await this.markersService.update(id, body);
  }

  @ApiOperation({
    summary: 'Delete marker',
    description: 'Delete marker by id',
  })
  @ApiOkResponse()
  @Delete('/:id')
  async deleteMarker(@Param('id', ParseUUIDPipe) id: string) {
    return await this.markersService.delete(id);
  }
}

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
import { Marker } from 'src/models/markers/entities/marker.entity';
import {
  CreateMarkerDto,
  UpdateMarkerDto,
} from 'src/models/markers/dto/markers.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  @ApiOkResponse({ type: [Marker] })
  @Get('/')
  async getAll() {
    return await this.markersService.getAllMarkers();
  }

  @ApiOperation({
    summary: 'Get marker',
    description: 'Get one marker by id',
  })
  @ApiOkResponse({ type: Marker })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.markersService.getById(id);
  }

  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  @ApiCreatedResponse({ type: Marker })
  @Post('/')
  async createMarker(@Body() body: CreateMarkerDto) {
    return await this.markersService.create(body);
  }

  @ApiOperation({
    summary: 'Update marker',
    description: 'Update marker by id',
  })
  @ApiOkResponse()
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
  async deleteMarker(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return await this.markersService.delete(id);
  }
}

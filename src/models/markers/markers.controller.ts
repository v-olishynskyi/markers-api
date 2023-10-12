import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { CreateMarkerDto } from 'src/models/markers/dto/markers.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';

@ApiTags('Markers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  @ApiOkResponse({ type: [Marker] })
  async getAll() {
    return await this.markersService.getAllMarkers();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get marker by id',
    description: 'Get one marker by id',
  })
  @ApiOkResponse({ type: Marker })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.markersService.getById(id);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  @ApiCreatedResponse({ type: Marker })
  async createMarker(@Body() body: CreateMarkerDto) {
    return await this.markersService.createMarker(body);
  }
}

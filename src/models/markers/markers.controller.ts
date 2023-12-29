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
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { Prisma } from '@prisma/client';

@ApiTags('Markers')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('markers')
export class MarkersController {
  constructor(private readonly markersService: MarkersService) {}

  @ApiOperation({ summary: 'Get markers', description: 'Get all markers' })
  // @ApiOkResponse({ type: [Marker] })
  @Get('/')
  async getAll() {
    return await this.markersService.getAll();
  }

  @ApiOperation({
    summary: 'Get marker',
    description: 'Get one marker by id',
  })
  // @ApiOkResponse({ type: Marker })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.markersService.getById(id);
  }

  @ApiOperation({ summary: 'Create marker', description: 'Create new marker' })
  // @ApiCreatedResponse({ type: Marker })
  @Post('/')
  async createMarker(@Body() body: Prisma.MarkerCreateInput) {
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
    @Body() body: Prisma.MarkerUpdateInput,
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

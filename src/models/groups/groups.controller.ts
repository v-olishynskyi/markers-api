import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupDto } from 'src/models/groups/dto/groups.dto';
import { Prisma } from '@prisma/client';

@ApiTags('Groups')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Get groups', description: 'Get all groups' })
  @ApiOkResponse({ type: [GroupDto] })
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.getById(id);
  }

  @Post()
  create(@Body() createGroupDto: Prisma.GroupCreateInput) {
    return this.groupsService.create(createGroupDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: Prisma.GroupUpdateInput,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGroupDto, GroupDto } from 'src/models/groups/dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/api/auth/auth.guard';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Get groups', description: 'Get all groups' })
  @ApiOkResponse({ type: [GroupDto] })
  @Get()
  findAll() {
    return this.groupsService.getAll();
  }

  @ApiOperation({
    summary: 'Get group by id',
    description: 'Get one group by id',
  })
  @ApiOkResponse({ type: GroupDto })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.getById(id, {
      include: { owner: true, members: { select: { user: true } } },
    });
  }

  @ApiOperation({
    summary: 'Create group',
    description: 'Create group with provided data',
  })
  @ApiCreatedResponse({ type: GroupDto })
  @Post('/')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiOperation({
    summary: 'Update group',
    description: 'Update group by id',
  })
  @ApiOkResponse({ type: GroupDto })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: Prisma.GroupUpdateInput,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({
    summary: 'Delete group',
    description: 'Delete group by id',
  })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.remove(id);
  }
}

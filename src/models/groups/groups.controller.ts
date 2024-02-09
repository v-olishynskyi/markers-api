import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Res,
  HttpStatus,
  Put,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateGroupDto,
  GroupDto,
  JoinOrLeaveGroupDto,
} from 'src/models/groups/dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { Response } from 'express';
import { GroupsFilterBy } from 'src/models/groups/enums';
import {
  ApiMessageResponse,
  ApiPaginationResponse,
} from 'src/common/decorators';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({ summary: 'Get groups', description: 'Get all groups' })
  @ApiPaginationResponse(GroupDto)
  @ApiQuery({ name: 'filter_by', required: false, enum: GroupsFilterBy })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('/')
  paginated(@Req() request: Request) {
    const userId = request['userId'];
    const params = request['query'];

    return this.groupsService.paginated(userId, params);
  }

  @ApiOperation({ summary: 'Get all groups', description: 'Get all groups' })
  @ApiOkResponse({ type: [GroupDto] })
  @Get('/get-all')
  all(@Req() request: Request) {
    const userId = request['userId'];
    const params = request['query'];

    return this.groupsService.getAll(userId, params);
  }

  @ApiOperation({
    summary: 'Get group',
    description: 'Get one group by id',
  })
  @ApiOkResponse({ type: GroupDto })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.findById(id);
  }

  @ApiOperation({
    summary: 'Create group',
    description: 'Create group with provided data',
  })
  @ApiCreatedResponse({ type: GroupDto })
  @Post('/')
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiOperation({
    summary: 'Update group',
    description: 'Update group by id',
  })
  @ApiOkResponse({ type: GroupDto })
  @Put(':id')
  updateGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: Prisma.GroupUpdateInput,
  ) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiOperation({
    summary: 'Delete group',
    description: 'Delete group by id',
  })
  @ApiMessageResponse()
  @Delete(':id')
  async deleteGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.groupsService.delete(id);

    return res.status(HttpStatus.OK).json({ message: 'Групу видалено' }).send();
  }

  @ApiOperation({ summary: 'Add member', description: 'Add member to group' })
  @ApiMessageResponse()
  @Post(`:group_id/join`)
  async join(
    @Param('group_id', ParseUUIDPipe) groupId: string,
    @Body() body: JoinOrLeaveGroupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.groupsService.addMember(body.user_id, groupId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Користувача додано до групи' })
      .send();
  }

  @ApiOperation({
    summary: 'Remove member',
    description: 'Remove member from group',
  })
  @ApiMessageResponse()
  @Post(`:group_id/leave`)
  async leave(
    @Param('group_id', ParseUUIDPipe) groupId: string,
    @Body() body: JoinOrLeaveGroupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.groupsService.removeMember(body.user_id, groupId);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Користувача видалено з групи' })
      .send();
  }
}

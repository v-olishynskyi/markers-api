import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Res,
  HttpStatus,
  Put,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
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
  FormDataToBodyInterceptor,
} from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOperation({
    summary: 'Get paginated groups',
    description: 'Get all groups with paginations',
  })
  @ApiPaginationResponse(GroupDto)
  @ApiQuery({ name: 'filter_by', required: false, enum: GroupsFilterBy })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('/')
  paginated(@Req() request: Request) {
    const params = request['query'];

    if (params.filter_by === GroupsFilterBy.By_User && !params.user_id) {
      throw new BadRequestException(
        'Param "user_id" should be passed with filter_by.by_user',
      );
    }

    const userId = params.user_id || request['userId'];

    return this.groupsService.paginated(userId, params);
  }

  @ApiOperation({ summary: 'Get groups', description: 'Get all groups' })
  @ApiOkResponse({ type: [GroupDto] })
  @ApiQuery({ name: 'filter_by', required: false, enum: GroupsFilterBy })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @Get('/get-all')
  all(@Req() request: Request) {
    const params = request['query'];

    if (params.filter_by === GroupsFilterBy.By_User && !params.user_id) {
      throw new BadRequestException(
        'Param "user_id" should be passed with "filter_by.by_user"',
      );
    }

    const userId = params.user_id || request['userId'];

    return this.groupsService.getAll(userId, params);
  }

  @ApiOperation({
    summary: 'Get group',
    description: 'Get one group by id',
  })
  @ApiOkResponse({ type: GroupDto })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = req['userId'];

    return this.groupsService.findById(id, undefined, userId);
  }

  @ApiOperation({
    summary: 'Create group',
    description: 'Create group with provided data',
  })
  @ApiCreatedResponse({ type: GroupDto })
  @UseInterceptors(
    FileInterceptor('avatar'),
    FormDataToBodyInterceptor([{ fieldName: 'group', extractToBody: true }]),
  )
  @Post('/')
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req['userId'];

    const group = await this.groupsService.create(
      { ...createGroupDto, owner_id: userId },
      avatar,
    );

    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Групу успішно створено', data: group })
      .send();
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

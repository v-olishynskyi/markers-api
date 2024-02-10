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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { Response } from 'express';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/models/users/dto';
import { ApiPaginationResponse } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/models/files/files.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  @ApiOperation({ summary: 'Get all users without pagination' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  @Get('/all')
  async getAllUsers() {
    return this.usersService.getAll();
  }

  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiPaginationResponse(UserDto)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('/paginated')
  async getAUsersWithPagination(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    const userId = req['userId'];

    return await this.usersService.paginated(userId, {
      page,
      limit,
      search,
    });
  }

  @ApiOperation({ summary: 'Get user', description: 'Get user by id' })
  @ApiOkResponse({ type: UserDto })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id, {
      include: { avatar: true },
    });

    return user;
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ type: UserDto })
  @Post('/')
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user by id',
  })
  @ApiOkResponse({ type: UserDto })
  @UseInterceptors(FileInterceptor('file'))
  @Put('/:id')
  async updateUser(
    @Body() data: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.update(id, data, avatar);
  }

  @ApiOperation({ summary: 'Delete user', description: 'Delete user by id' })
  @ApiOkResponse()
  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.usersService.delete(id);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'User successfuly deleted' })
      .send();
  }
}

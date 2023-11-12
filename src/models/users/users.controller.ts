import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserProfileDto,
} from './dto/users.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { ApiPaginationResponse } from 'src/common/decorators/ApiPaginatedResponse.decorator';
import { PaginationResponse } from 'src/common/helpers';
import { UserSession } from 'src/api/auth/entities/user-sessions.entity';
import { QueryTypes } from 'sequelize';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  @Get('/all')
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getAll();
    return users.map((user) => ({ ...user, password: '' }));
  }

  @ApiOperation({ summary: 'Get all users with paginations' })
  @ApiPaginationResponse(UserDto)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Get('/')
  async getAllUsersByPaginations(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search?: string | null,
  ): Promise<PaginationResponse<UserDto>> {
    return await this.usersService.paginated({
      page,
      limit,
      search: search,
    });
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: HttpStatus.OK, type: UserProfileDto })
  @Get('/profile')
  async getProfile(
    @Req() req: Request,
    @Headers('X-Device-Ip') ip: string | null,
    @Headers('X-App-Version') app_version: string | null,
  ): Promise<UserProfileDto> {
    const userId = req['userId'];
    const userSessionId = req['userSessionId'];

    return await this.usersService.getProfile(
      userId,
      userSessionId,
      app_version,
      ip,
    );
  }

  @ApiOperation({ summary: 'Get user', description: 'Get user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    const user = await this.usersService.getById(id);
    return { ...user };
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('/')
  async createUser(@Body() data: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(data);
    return { ...user };
  }

  @ApiOperation({ summary: 'Update user', description: 'Update user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @Put('/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, data);
    return { ...user };
  }

  @ApiOperation({ summary: 'Delete user', description: 'Delete user by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return await this.usersService.delete(id);
  }
}

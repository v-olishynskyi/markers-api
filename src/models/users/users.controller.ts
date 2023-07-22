import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/users.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { ApiPaginationResponse } from 'src/common/decorators/ApiPaginatedResponse.decorator';
import { PaginationResponse } from 'src/common/helpers';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get('/all')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getAll();
    return users;
  }

  @ApiOperation({ summary: 'Get all users with paginations' })
  @ApiPaginationResponse(UserDto)
  @Get('/')
  async getAllUsersByPaginations(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginationResponse<UserDto>> {
    return await this.usersService.paginated({
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Get user profile' })
  @Get('/profile')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getProfile(@Req() req: Request) {
    const userId = req['userId'];

    const user = await this.usersService.getById(userId);

    return user;
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get('/:id')
  // @UseInterceptors(new SerializeInterceptor(['password']))
  @ApiResponse({ status: HttpStatus.OK })
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.getById(id);
    return user;
  }

  @ApiOperation({ summary: 'Create user' })
  @Post('/')
  @ApiResponse({ status: HttpStatus.CREATED, type: [UserDto] })
  async create(@Body() data: CreateUserDto): Promise<UserDto> {
    try {
      return this.usersService.create(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Put('/:id')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      return this.usersService.update(id, data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Delete('/:id')
  @ApiResponse({ status: HttpStatus.OK })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    try {
      return this.usersService.delete(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}

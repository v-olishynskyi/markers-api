import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/users.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { SerializeInterceptor } from 'src/shared/interceptors';
import { PaginatedResponse } from 'src/shared/types';
import { ApiPaginationResponse } from 'src/shared/decorators/ApiPaginatedResponse.decorator';
import { MarkerDto } from 'src/api/markers/dto/markers.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getAll();
    return users;
  }

  @Get('/')
  @ApiPaginationResponse(UserDto)
  async getAllUsersByPaginations(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ): Promise<PaginatedResponse<UserDto>> {
    const offset = page * limit;

    const paginatedResponse = await this.usersService.paginated({
      limit,
      offset,
    });

    const response: PaginatedResponse<UserDto> = {
      data: paginatedResponse.rows,
      limit,
      page,
      total: paginatedResponse.count,
    };

    return response;
  }

  @Get('/profile')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getProfile(@Req() req: Request) {
    const userId = req['userId'];

    const user = await this.usersService.getById(userId);

    return user;
  }

  @Get('/:id')
  // @UseInterceptors(new SerializeInterceptor(['password']))
  @ApiResponse({ status: HttpStatus.OK })
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.getById(id);
    return user;
  }

  @Post('/')
  @ApiResponse({ status: HttpStatus.CREATED, type: [UserDto] })
  async create(@Body() data: CreateUserDto): Promise<UserDto> {
    try {
      return this.usersService.create(data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

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

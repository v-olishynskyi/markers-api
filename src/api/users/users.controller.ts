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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto/users.dto';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { SerializeInterceptor } from 'src/shared/interceptors';

@ApiTags('Users')
// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.getAll();
    return users;
  }

  @Get('/:id')
  @UseInterceptors(new SerializeInterceptor(['password']))
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

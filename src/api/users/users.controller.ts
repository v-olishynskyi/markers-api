import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @ApiResponse({ status: HttpStatus.OK, type: [UserDto] })
  async getAllUsers(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  @ApiResponse({ status: HttpStatus.OK })
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }
}

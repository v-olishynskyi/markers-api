import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/api/users/dto/users.dto';
import { SignInDto } from './dto/auth.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registration for new user' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('/sign-up')
  async signUp(@Body() signUpData: CreateUserDto) {
    return await this.authService.register(signUpData);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('/sign-in')
  async signIn(
    @Body() signInData: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.signIn(signInData);

    // res.cookie()

    return authResult;
  }
}

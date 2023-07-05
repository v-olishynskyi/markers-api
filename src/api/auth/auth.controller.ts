import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/models/users/dto/users.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @ApiOperation({ summary: 'Registration for new user' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('/sign-up')
  async signUp(@Body() signUpData: CreateUserDto) {
    try {
      await this.authService.signUp({
        ...signUpData,
        email: signUpData.email.toLowerCase(),
      });

      return {
        message: 'Реєстрація успішна',
      };
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}

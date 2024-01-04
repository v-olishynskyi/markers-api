import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshTokenResponseDto, SignInDto, SignInResponseDto } from './dto';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/models/users/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Authorization by email and password',
  })
  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseDto })
  @Post('/sign-in')
  async signIn(
    @Body() signInData: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers('X-Device-Ip') ip: string | null,
    @Headers('X-App-Version') app_version: string | null,
  ) {
    const { access_token, refresh_token, session_id } =
      await this.authService.signIn(signInData, ip, app_version);

    const response: SignInResponseDto = {
      access_token,
      refresh_token,
      session_id,
    };

    res.cookie('refresh_token', refresh_token, {});
    res.cookie('session_id', session_id, {});

    return response;
  }

  @ApiOperation({
    summary: 'Registration',
    description: 'Registration new user',
  })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('/sign-up')
  async signUp(
    @Body() signUpData: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signUp({
      ...signUpData,
      email: signUpData.email.toLowerCase(),
    });

    return res
      .status(HttpStatus.CREATED)
      .json({
        message: 'Реєстрація успішна',
      })
      .send();
  }

  @ApiOperation({
    summary: 'Refresh',
    description: 'Refresh user access token by refresh token',
  })
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @Post('/refresh')
  async refreshAccessToken(@Req() req: Request) {
    let refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      refreshToken = req.body['refresh_token'];
    }

    const response = await this.authService.refreshAccessToken(refreshToken);

    return response;
  }

  @ApiOperation({
    summary: 'Logout',
  })
  @ApiOkResponse()
  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let sessionId = req.cookies['session_id'];

    if (!sessionId) {
      sessionId = req.body['session_id'];
    }

    await this.authService.logout(sessionId);

    res.clearCookie('refresh_token');
    res.clearCookie('session_id');
  }
}

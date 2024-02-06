import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  Headers,
  UseInterceptors,
  UploadedFile,
  Delete,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { ProfileService } from './profile.service';
import { FilesService } from 'src/models/files/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/models/users/users.service';
import { FileTypeEnum } from 'src/models/files/enums';
import { Prisma } from '@prisma/client';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get profile' })
  @ApiOkResponse({ type: UserProfileDto })
  @Get('/')
  getProfile(
    @Req() req: Request,
    @Headers('X-Device-Ip') ip: string | null,
    @Headers('X-App-Version') app_version: string | null,
  ) {
    const userId = req['userId'];
    const userSessionId = req['userSessionId'];

    return this.profileService.getProfile(
      userId,
      userSessionId,
      app_version,
      ip,
    );
  }

  @ApiOperation({ summary: 'Update profile' })
  @ApiOkResponse({ type: UserProfileDto })
  @Put('/')
  updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
    const userId = req['userId'];

    return this.profileService.updateProfile(userId, body);
  }

  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiOkResponse({ type: UserProfileDto })
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-avatar')
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    const userAvatar = (await this.usersService.getById(userId, {
      select: { avatar: { select: { id: true } } },
    })) as unknown as Prisma.UserGetPayload<{
      select: { avatar: { select: { id: true } } };
    }>;

    if (userAvatar.avatar?.id) {
      await this.filesService.delete(userAvatar.avatar.id);
    }

    await this.filesService.create({
      file,
      entity: { id: userId, type: FileTypeEnum.USER_AVATAR },
    });

    return this.profileService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Delete user avatar' })
  @ApiOkResponse({ type: UserProfileDto })
  @Delete('/delete-avatar')
  async deleteAvatar(@Req() req: Request) {
    const userId = req['userId'];

    const userAvatar = (await this.usersService.getById(userId, {
      select: { avatar: { select: { id: true } } },
    })) as unknown as Prisma.UserGetPayload<{
      select: { avatar: { select: { id: true } } };
    }>;

    if (userAvatar?.avatar?.id) {
      await this.filesService.delete(userAvatar.avatar.id);
    }

    return await this.profileService.getProfile(userId);
  }
}

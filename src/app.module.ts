import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/api/auth/auth.module';
import { FilesModule } from 'src/models/files/files.module';
import { UsersModule } from 'src/models/users/users.module';
import { MarkersModule } from 'src/models/markers/markers.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GroupsModule } from 'src/models/groups/groups.module';
import { ProfileModule } from 'src/models/profile/profile.module';

@Module({
  imports: [
    AuthModule,
    MarkersModule,
    FilesModule,
    GroupsModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      exclude: ['/api/(.*)'],
    }),
    ProfileModule,
  ],
})
export class AppModule {}

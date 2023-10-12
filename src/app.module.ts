import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/api/auth/auth.module';
import { FilesModule } from 'src/models/files/files.module';
import { UsersModule } from 'src/models/users/users.module';
import { MarkersModule } from 'src/models/markers/markers.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MarkersModule,
    FilesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/models/users/users.module';
import { MarkersModule } from 'src/models/markers/markers.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MarkersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

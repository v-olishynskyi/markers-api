import { Module } from '@nestjs/common';
import { AuthModule } from 'src/api/auth/auth.module';
import { UsersModule } from 'src/api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MarkersModule } from 'src/api/markers/markers.module';

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

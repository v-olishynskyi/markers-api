import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsRepository, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}

import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { DatabaseModule } from 'src/providers/database/postgres/database.module';
import { GroupsRepository } from 'src/models/groups/groups.repository';
import { groupsProviders } from 'src/models/groups/groups.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsRepository, ...groupsProviders],
  exports: [GroupsService],
})
export class GroupsModule {}

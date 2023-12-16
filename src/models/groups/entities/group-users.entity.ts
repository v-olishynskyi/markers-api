import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from 'src/models/groups/entities/group.entity';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: {
    plural: 'groupusers',
    singular: 'groupuser',
  },
  hooks: {
    async beforeCreate(groupUser: GroupUsers) {
      groupUser.id = uuid();
    },
  },
})
export class GroupUsers extends Model<GroupUsers> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: { name: 'id', msg: 'must be unique' },
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => User)
  user_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ForeignKey(() => Group)
  group_id: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

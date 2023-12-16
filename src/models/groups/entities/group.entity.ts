import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { GroupUsers } from 'src/models/groups/entities/group-users.entity';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: {
    plural: 'groups',
    singular: 'group',
  },
  hooks: {
    async beforeCreate(group: Group) {
      group.id = uuid();
    },
  },
})
export class Group extends Model<Group> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: { name: 'id', msg: 'must be unique' },
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => User, () => GroupUsers)
  members: User[];

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

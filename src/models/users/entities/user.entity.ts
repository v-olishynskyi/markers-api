import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  IsEmail,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserSession } from 'src/api/auth/entities/user-sessions.entity';
import { heshPassword } from 'src/common/helpers';
import { PublicFile } from 'src/models/files/entities/file.entity';
import { GroupUsers } from 'src/models/groups/entities/group-users.entity';
import { Group } from 'src/models/groups/entities/group.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: { plural: 'Users', singular: 'User' },
  hooks: {
    async beforeCreate(user: User) {
      user.id = uuid();
      user.password = await heshPassword(user.password);
    },
  },
  underscored: false,
  timestamps: true,
  defaultScope: {
    nest: true,
    include: PublicFile,
  },
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @IsEmail
  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    defaultValue: null,
  })
  username: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  middle_name: string | null;

  @HasOne(() => PublicFile, 'user_id')
  avatar: PublicFile | null;

  @HasMany(() => UserSession, 'user_id')
  sessions: UserSession[];

  @BelongsToMany(() => Group, () => GroupUsers)
  groups: Group[];

  // @HasMany(() => PublicFile, 'user_id')
  // files: PublicFile[];

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

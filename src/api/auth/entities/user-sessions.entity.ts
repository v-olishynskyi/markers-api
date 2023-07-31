import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: { plural: 'user-sessions', singular: 'user-session' },
  hooks: {
    async beforeCreate(userSession: UserSession) {
      userSession.id = uuid();
    },
  },
  underscored: false,
  timestamps: true,
})
export class UserSession extends Model<UserSession> {
  @IsUUID('4')
  @PrimaryKey
  @Column
  id: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @Column
  device: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

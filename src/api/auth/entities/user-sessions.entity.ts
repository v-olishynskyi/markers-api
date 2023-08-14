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
import { UserSessionDeviceDto } from 'src/api/auth/dto/user-sessions.dto';
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

  @BelongsTo(() => User, 'user_id')
  user: User;

  @Column({ type: DataTypes.JSON, allowNull: true, defaultValue: null })
  device: UserSessionDeviceDto | null;

  @Column({ type: DataTypes.CIDR, allowNull: true, defaultValue: null })
  ip: string | null;

  @Column({ type: DataTypes.STRING, allowNull: true, defaultValue: null })
  app_version: string | null;

  @Column({ type: DataTypes.STRING, allowNull: true, defaultValue: null })
  location: string | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

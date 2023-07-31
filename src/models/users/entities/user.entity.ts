import {
  Column,
  CreatedAt,
  DataType,
  IsEmail,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { heshPassword } from 'src/common/helpers';
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
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare id: string;

  @IsEmail
  @Unique
  @Column
  email: string;

  @Column
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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
    defaultValue: null,
  })
  avatar_url: string | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}
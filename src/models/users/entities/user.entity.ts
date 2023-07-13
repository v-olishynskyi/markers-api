import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { heshPassword } from 'src/common/helpers';
import { v4 as uuid } from 'uuid';

@Table({
  name: { plural: 'users', singular: 'user' },
  hooks: {
    async beforeCreate(user: User) {
      user.id = uuid();
      user.password = await heshPassword(user.password);
    },
  },
  underscored: true,
  timestamps: false,
  // updatedAt: 'updated_at',
  // createdAt: 'created_at',
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    // allowNull: false,
    unique: { name: 'id', msg: 'must be unique' },
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: { name: 'email', msg: 'must be unique' },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    defaultValue: null,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
  })
  middle_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false,
    defaultValue: null,
  })
  avatar_url: string;
}

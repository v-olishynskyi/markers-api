import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { heshPassword } from 'src/helpers';
import { v4 as uuid } from 'uuid';

@Table({
  name: { plural: 'users', singular: 'user' },
  hooks: {
    async beforeCreate(user: User) {
      user.id = uuid();
      user.password = await heshPassword(user.password);
    },
  },
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    // allowNull: false,
    unique: { name: 'id', msg: 'must be unique' },
  })
  id: string;

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
  })
  avatar_url: string;
}

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Marker } from 'src/models/markers/entities/marker.entity';
import { User } from 'src/models/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: {
    plural: 'files',
    singular: 'file',
  },
  hooks: {
    async beforeCreate(publicFile: PublicFile) {
      publicFile.id = uuid();
    },
  },
})
export class PublicFile extends Model<PublicFile> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    unique: { name: 'id', msg: 'must be unique' },
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  key: string | null;

  // relations
  @ForeignKey(() => Marker)
  marker_id: string;

  @BelongsTo(() => Marker, 'marker_id')
  marker: Marker;

  @ForeignKey(() => User)
  user_id: string;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}

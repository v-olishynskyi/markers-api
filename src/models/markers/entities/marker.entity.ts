import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { PublicFile } from 'src/models/files/entities/file.entity';
import { v4 as uuid } from 'uuid';

@Table({
  name: {
    plural: 'markers',
    singular: 'marker',
  },
  hooks: {
    async beforeCreate(marker: Marker) {
      marker.id = uuid();
    },
  },
})
export class Marker extends Model<Marker> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    unique: { name: 'id', msg: 'must be unique' },
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string | null;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  latitude: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  longitude: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_draft: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_hidden: boolean;

  @HasMany(() => PublicFile, 'marker_id')
  images: PublicFile[];

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;

  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  // @HasOne(() => User, 'user_id')
  // user: User;
}

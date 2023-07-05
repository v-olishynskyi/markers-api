import { Column, DataType, Model, Table } from 'sequelize-typescript';
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
    unique: { name: 'name', msg: 'must be unique' },
  })
  name: string;
}

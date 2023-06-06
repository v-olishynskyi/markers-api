import { Model, Table } from 'sequelize-typescript';

@Table({ name: { plural: 'userSessions', singular: 'userSession' } })
export class UserSession extends Model<UserSession> {}

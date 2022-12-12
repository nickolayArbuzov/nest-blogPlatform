import { Connection } from 'mongoose';
import { UserSchema } from '../domain/entitites/user.schema';

export const usersProviders = [
  {
    provide: 'USER_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Users', UserSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
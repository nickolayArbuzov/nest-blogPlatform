import { Connection } from 'mongoose';
import { BloggerUserSchema } from '../domain/entitites/blogger-user.schema';

export const bloggerUserProviders = [
  {
    provide: 'BLOGGER-USER_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Blogger-User', BloggerUserSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
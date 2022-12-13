import { Connection } from 'mongoose';
import { BlogSchema } from '../domain/entitites/blogger.schema';

export const bloggerProviders = [
  {
    provide: 'BLOG_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Blogs', BlogSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
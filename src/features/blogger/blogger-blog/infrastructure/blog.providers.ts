import { Connection } from 'mongoose';
import { BlogSchema } from '../domain/entitites/blog.schema';

export const blogsProviders = [
  {
    provide: 'BLOG_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Blogs', BlogSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
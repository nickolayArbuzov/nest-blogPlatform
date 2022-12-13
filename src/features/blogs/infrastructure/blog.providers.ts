import { Connection } from 'mongoose';
import { BlogSchema } from '../../blogger/blogger-blog/domain/entitites/blogger.schema';

export const blogsProviders = [
  {
    provide: 'BLOG_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Blogs', BlogSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
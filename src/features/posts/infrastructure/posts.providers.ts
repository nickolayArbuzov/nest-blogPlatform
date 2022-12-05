import { Connection } from 'mongoose';
import { PostSchema } from '../domain/entitites/post.schema';

export const postsProviders = [
  {
    provide: 'POST_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Posts', PostSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
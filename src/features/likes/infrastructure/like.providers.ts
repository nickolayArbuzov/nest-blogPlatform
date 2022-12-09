import { Connection } from 'mongoose';
import { LikeSchema } from '../domain/entitites/like.schema';

export const likesProviders = [
  {
    provide: 'LIKE_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Likes', LikeSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
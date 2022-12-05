import { Connection } from 'mongoose';
import { CommentSchema } from '../domain/entitites/comments.schema';

export const commentsProviders = [
  {
    provide: 'COMMENT_MONGOOSE',
    useFactory: (connection: Connection) => connection.model('Comment', CommentSchema),
    inject: ['DATABASE_MONGOOSE'],
  }
];
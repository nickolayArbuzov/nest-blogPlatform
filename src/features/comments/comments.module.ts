import { Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from './api/comments.controller';
import { CommentsRepo } from './infrastructure/comments.repo';
import { commentsProviders } from './infrastructure/comments.providers';
import { CommentsMongoose } from './infrastructure/comments.repositoryMongo';
import { DatabaseModule } from '../../outerservices/database/database.module';

@Module({
  controllers: [CommentsController],
  imports: [DatabaseModule],
  providers: [
    ...commentsProviders,
    CommentsService,
    CommentsRepo,
    CommentsMongoose,
  ],
  exports: [
    CommentsRepo,
    commentsProviders.find(v => v.provide === 'COMMENT_MONGOOSE'),
  ]
})
export class CommentsModule {}

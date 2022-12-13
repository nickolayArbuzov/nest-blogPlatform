import { Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from './api/comments.controller';
import { CommentsRepo } from './infrastructure/comments.repo';
import { commentsProviders } from './infrastructure/comments.providers';
import { CommentsMongoose } from './infrastructure/comments.repositoryMongo';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { LikesModule } from '../likes/likes.module';
import { JwtService } from '@nestjs/jwt';
import { LikeUseCase } from './application/use-cases/Like';
import { UpdateOneCommentByIdUseCase } from './application/use-cases/UpdateOneCommentById';
import { DeleteOneCommentByIdUseCase } from './application/use-cases/DeleteOneCommentById';
import { FindOneCommentByIdUseCase } from './application/use-cases/FindOneCommentById';
import { CqrsModule } from '@nestjs/cqrs';

const commands = [LikeUseCase, UpdateOneCommentByIdUseCase, DeleteOneCommentByIdUseCase]
const queries = [FindOneCommentByIdUseCase]

@Module({
  controllers: [CommentsController],
  imports: [DatabaseModule, LikesModule, CqrsModule],
  providers: [
    ...commentsProviders,
    CommentsService,
    CommentsRepo,
    CommentsMongoose,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    CommentsRepo,
    commentsProviders.find(v => v.provide === 'COMMENT_MONGOOSE'),
  ]
})
export class CommentsModule {}

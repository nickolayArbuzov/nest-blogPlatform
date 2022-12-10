import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesModule } from '../likes/likes.module';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { postsProviders } from './infrastructure/posts.providers';
import { PostsRepo } from './infrastructure/posts.repo';
import { PostsMongoose } from './infrastructure/posts.repositoryMongo';

@Module({
  controllers: [PostsController],
  imports: [DatabaseModule, CommentsModule, LikesModule],
  providers: [
    ...postsProviders,
    PostsService,
    PostsRepo,
    PostsMongoose,
    JwtService,
  ],
  exports: [
    PostsRepo,
    postsProviders.find(v => v.provide === 'POST_MONGOOSE'),
  ]
})
export class PostsModule {}

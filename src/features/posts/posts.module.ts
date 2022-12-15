import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { BlogsModule } from '../blogs/blogs.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesModule } from '../likes/likes.module';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { CreateOneCommentByPostIdUseCase } from './application/use-cases/CreateOneCommentByPostId';
import { FindAllPostsUseCase } from './application/use-cases/FindAllPosts';
import { FindCommentsByPostIdCase } from './application/use-cases/FindCommentsByPostId';
import { FindOnePostByIdUseCase } from './application/use-cases/FindOnePostById';
import { LikeUseCase } from './application/use-cases/Like';
import { postsProviders } from './infrastructure/posts.providers';
import { PostsRepo } from './infrastructure/posts.repo';
import { PostsMongoose } from './infrastructure/posts.repositoryMongo';

const commands = [LikeUseCase, CreateOneCommentByPostIdUseCase]
const queries = [FindCommentsByPostIdCase, FindAllPostsUseCase, FindOnePostByIdUseCase]

@Module({
  controllers: [PostsController],
  imports: [DatabaseModule, CommentsModule, LikesModule, CqrsModule, forwardRef(() => BlogsModule)],
  providers: [
    ...postsProviders,
    PostsService,
    PostsRepo,
    PostsMongoose,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    PostsRepo,
    postsProviders.find(v => v.provide === 'POST_MONGOOSE'),
  ]
})
export class PostsModule {}

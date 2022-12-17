import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { LikesModule } from '../likes/likes.module';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { FindAllBlogsUseCase } from './application/use-cases/FindAllBlogs';
import { FindOneBlogByIdUseCase } from './application/use-cases/FindOneBlogById';
import { FindPostsByBlogIdUseCase } from './application/use-cases/FindPostsByBlogId';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { blogsProviders } from '../../shared/collections/Blog/blog.providers';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { BlogsMongoose } from './infrastructure/blogs.repositoryMongoose';
import { LoggerModule } from '../../helpers/logger/logger.module';

const commands = []
const queries = [FindAllBlogsUseCase, FindPostsByBlogIdUseCase, FindOneBlogByIdUseCase]

@Module({
  controllers: [BlogsController],
  imports: [DatabaseModule, PostsModule, LikesModule, CqrsModule],
  providers: [
    LoggerModule,
    ...blogsProviders,
    BlogsService,
    BlogsRepo,
    BlogsMongoose,
    BlogIsExistRule,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    BlogsRepo,
    blogsProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BlogsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../outerservices/database/database.module';
import { PostsRepo } from '../posts/infrastructure/posts.repo';
import { PostsMongoose } from '../posts/infrastructure/posts.repositoryMongo';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { blogsProviders } from './infrastructure/blog.providers';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { BlogsMongoose } from './infrastructure/blogs.repositoryMongoose';

@Module({
  controllers: [BlogsController],
  imports: [DatabaseModule, PostsModule],
  providers: [
    ...blogsProviders,
    BlogsService,
    BlogsRepo,
    BlogsMongoose,
    BlogIsExistRule,
  ],
  exports: [
    blogsProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BlogsModule {}

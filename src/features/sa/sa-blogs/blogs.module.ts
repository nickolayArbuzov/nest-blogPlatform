import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { LikesModule } from '../../likes/likes.module';
import { PostsModule } from '../../posts/posts.module';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { blogsProviders } from './infrastructure/blog.providers';
import { BlogsRepo } from './infrastructure/blogs.repo';
import { BlogsMongoose } from './infrastructure/blogs.repositoryMongoose';

@Module({
  controllers: [BlogsController],
  imports: [DatabaseModule, PostsModule, LikesModule],
  providers: [
    ...blogsProviders,
    BlogsService,
    BlogsRepo,
    BlogsMongoose,
    BlogIsExistRule,
    JwtService,
  ],
  exports: [
    blogsProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BlogsModule {}

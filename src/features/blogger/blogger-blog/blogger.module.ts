import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { LikesModule } from '../../likes/likes.module';
import { PostsModule } from '../../posts/posts.module';
import { BloggerController } from './api/blogger.controller';
import { BloggerService } from './application/blogger.service';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { bloggerProviders } from './infrastructure/blogger.providers';
import { BloggerRepo } from './infrastructure/blogger.repo';
import { BloggerMongoose } from './infrastructure/blogger.repositoryMongoose';

@Module({
  controllers: [BloggerController],
  imports: [DatabaseModule, PostsModule, LikesModule],
  providers: [
    ...bloggerProviders,
    BloggerService,
    BloggerRepo,
    BloggerMongoose,
    BlogIsExistRule,
    JwtService,
  ],
  exports: [
    bloggerProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BloggerModule {}

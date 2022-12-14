import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { LikesModule } from '../../likes/likes.module';
import { PostsModule } from '../../posts/posts.module';
import { BloggerController } from './api/blogger.controller';
import { BloggerService } from './application/blogger.service';
import { CreateOneBlogUseCase } from './application/use-cases/CreateOneBlog';
import { CreateOnePostForBlogIdUseCase } from './application/use-cases/CreateOnePostForBlogId';
import { DeleteOneBlogByIdUseCase } from './application/use-cases/DeleteOneBlogById';
import { DeleteOnePostOverBlogUseCase } from './application/use-cases/DeleteOnePostOverBlog';
import { FindAllBlogsUseCase } from './application/use-cases/FindAllBlogs';
import { UpdateOneBlogByIdUseCase } from './application/use-cases/UpdateOneBlogById';
import { UpdateOnePostOverBlogUseCase } from './application/use-cases/UpdateOnePostOverBlog';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { blogsProviders } from '../../../shared/collections/Blog/blog.providers';
import { BloggerRepo } from './infrastructure/blogger.repo';
import { BloggerMongoose } from './infrastructure/blogger.repositoryMongoose';

const commands = [
  DeleteOneBlogByIdUseCase, CreateOneBlogUseCase, CreateOnePostForBlogIdUseCase, 
  DeleteOnePostOverBlogUseCase, UpdateOneBlogByIdUseCase, UpdateOnePostOverBlogUseCase
]
const queries = [FindAllBlogsUseCase]

@Module({
  controllers: [BloggerController],
  imports: [DatabaseModule, PostsModule, LikesModule, CqrsModule],
  providers: [
    ...blogsProviders,
    BloggerService,
    BloggerRepo,
    BloggerMongoose,
    BlogIsExistRule,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    blogsProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BloggerModule {}

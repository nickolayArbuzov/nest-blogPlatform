import { Module, forwardRef } from '@nestjs/common';
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
import { FindAllCommentsForUsersBlogsUseCase } from './application/use-cases/FindAllCommentsForUsersBlogs';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { CommentsModule } from '../../comments/comments.module';
import { BloggerSQL } from './infrastructure/blogger.repositorySQL';

const commands = [
  DeleteOneBlogByIdUseCase, CreateOneBlogUseCase, CreateOnePostForBlogIdUseCase, 
  DeleteOnePostOverBlogUseCase, UpdateOneBlogByIdUseCase, UpdateOnePostOverBlogUseCase,
]
const queries = [FindAllBlogsUseCase, FindAllCommentsForUsersBlogsUseCase]

@Module({
  controllers: [BloggerController],
  imports: [DatabaseModule, forwardRef(() => PostsModule), LikesModule, CqrsModule, LoggerModule, CommentsModule],
  providers: [
    ...blogsProviders,
    BloggerService,
    BloggerRepo,
    BloggerMongoose,
    BloggerSQL,
    BlogIsExistRule,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    BloggerRepo,
    blogsProviders.find(v => v.provide === 'BLOG_MONGOOSE'),
  ]

})
export class BloggerBlogModule {}

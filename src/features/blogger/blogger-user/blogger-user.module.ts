import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { LikesModule } from '../../likes/likes.module';
import { PostsModule } from '../../posts/posts.module';
import { BloggerController } from './api/blogger.controller';
import { BanUserByIdByIdUseCase } from './application/use-cases/BanUserByIdById';
import { FindAllBannedUsersUseCase } from './application/use-cases/FindAllBannedUsers';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { blogsProviders } from '../../../shared/collections/Blog/blog.providers';
import { BloggerRepo } from './infrastructure/blogger.repo';
import { BloggerMongoose } from './infrastructure/blogger.repositoryMongoose';

const commands = [BanUserByIdByIdUseCase]
const queries = [FindAllBannedUsersUseCase]

@Module({
  controllers: [BloggerController],
  imports: [DatabaseModule, PostsModule, LikesModule, CqrsModule],
  providers: [
    ...blogsProviders,
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
export class BloggerUserModule {}

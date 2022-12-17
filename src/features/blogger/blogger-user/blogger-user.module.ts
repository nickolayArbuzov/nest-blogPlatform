import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../../../outerservices/database/database.module';
import { LikesModule } from '../../likes/likes.module';
import { PostsModule } from '../../posts/posts.module';
import { BloggerUserController } from './api/blogger-user.controller';
import { BanUserByIdUseCase } from './application/use-cases/BanUserById';
import { FindAllBannedUsersByBlogIdUseCase } from './application/use-cases/FindAllBannedUsersByBlogId';
import { BlogIsExistRule } from './custom-validators/customValidateBlog';
import { bloggerUserProviders } from './infrastructure/blogger-user.providers';
import { BloggerUserRepo } from './infrastructure/blogger-user.repo';
import { BloggerUserMongoose } from './infrastructure/blogger-user.repositoryMongoose';
import { LoggerModule } from '../../../helpers/logger/logger.module';
import { SAUsersModule } from '../../sa/sa-users/sa-users.module';

const commands = [BanUserByIdUseCase]
const queries = [FindAllBannedUsersByBlogIdUseCase]

@Module({
  controllers: [BloggerUserController],
  imports: [DatabaseModule, PostsModule, LikesModule, CqrsModule, LoggerModule, SAUsersModule],
  providers: [
    ...bloggerUserProviders,
    BloggerUserRepo,
    BloggerUserMongoose,
    BlogIsExistRule,
    JwtService,
    ...commands,
    ...queries,
  ],
  exports: [
    bloggerUserProviders.find(v => v.provide === 'BLOGGER-USER_MONGOOSE'),
  ]

})
export class BloggerUserModule {}

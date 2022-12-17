import { Module } from '@nestjs/common';
import { DevicesModule } from '../../features/devices/devices.module';
import { BlogsModule } from '../../features/blogs/blogs.module';
import { CommentsModule } from '../../features/comments/comments.module';
import { PostsModule } from '../../features/posts/posts.module';
import { SAUsersModule } from '../../features/sa/sa-users/sa-users.module';
import { LikesModule } from '../../features/likes/likes.module';
import { LoggerModule } from '../logger/logger.module';
import { AllDataController } from './delete-all-data.controller';
import { AllDataService } from './delete-all-data.service';
import { BloggerUserModule } from '../../features/blogger/blogger-user/blogger-user.module';

@Module({
  controllers: [AllDataController],
  imports: [BlogsModule, PostsModule, SAUsersModule, CommentsModule, DevicesModule, LikesModule, LoggerModule, BloggerUserModule],
  providers: [
    AllDataService,
  ],
})
export class AllDataModule {}

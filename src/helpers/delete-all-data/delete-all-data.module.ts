import { Module } from '@nestjs/common';
import { DevicesModule } from '../../features/devices/devices.module';
import { BlogsModule } from '../../features/blogs/blogs.module';
import { CommentsModule } from '../../features/comments/comments.module';
import { PostsModule } from '../../features/posts/posts.module';
import { UsersModule } from '../../features/users/users.module';
import { AllDataController } from './delete-all-data.controller';
import { AllDataService } from './delete-all-data.service';

@Module({
  controllers: [AllDataController],
  imports: [BlogsModule, PostsModule, UsersModule, CommentsModule, DevicesModule],
  providers: [
    AllDataService,
  ],
})
export class AllDataModule {}

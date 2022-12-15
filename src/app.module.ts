import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './outerservices/database/database.module';
import { AllDataModule } from './helpers/delete-all-data/delete-all-data.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { CommentsModule } from './features/comments/comments.module';
import { PostsModule } from './features/posts/posts.module';
import { SAUsersModule } from './features/sa/sa-users/sa-users.module';
import { AuthModule } from './features/auth/auth.module';
import { DevicesModule } from './features/devices/devices.module';
import { LikesModule } from './features/likes/likes.module';
import { BloggerBlogModule } from './features/blogger/blogger-blog/blogger-blog.module';
import { SABlogsModule } from './features/sa/sa-blogs/sa-blogs.module';
import { BloggerUserModule } from './features/blogger/blogger-user/blogger-user.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
  ],
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    BlogsModule,
    BloggerBlogModule,
    BloggerUserModule,
    PostsModule,
    CommentsModule,
    SAUsersModule,
    SABlogsModule,
    AuthModule,
    DevicesModule,
    LikesModule,
    AllDataModule,
  ],
})
export class AppModule {}


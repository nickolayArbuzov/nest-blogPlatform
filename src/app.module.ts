import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './outerservices/database/database.module';
import { AllDataModule } from './helpers/delete-all-data/delete-all-data.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { CommentsModule } from './features/comments/comments.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { DevicesModule } from './features/devices/devices.module';
import { LikesModule } from './features/likes/likes.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
  ],
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    AuthModule,
    DevicesModule,
    LikesModule,
    AllDataModule,
  ],
})
export class AppModule {}


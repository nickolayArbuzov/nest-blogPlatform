import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './outerservices/database/database.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { CommentsModule } from './features/comments/comments.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';
import { AllDataModule } from './helpers/delete-all-data/delete-all-data.module';

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
    AllDataModule,
  ],
})
export class AppModule {}


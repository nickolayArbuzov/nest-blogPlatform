import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
  ],
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({inject: [ConfigService], useFactory: (configService: ConfigService) => {
      const host = configService.get('POSTGRES_HOST')
      const port = +configService.get('POSTGRES_PORT')
      const username = configService.get('POSTGRES_USER')
      const password = configService.get('POSTGRES_PASS')
      const database = configService.get('POSTGRES_DB')
      console.log('host', host)
      return {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        autoLoadEntities: false,
        synchronize: false,
      }
    }}),
    // TypeOrmModule.forRootAsync(() => {
    //   return { 
    //   type: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: Number(process.env.POSTGRES_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASS,
    //   database: process.env.POSTGRES_DB,
    //   autoLoadEntities: false,
    //   synchronize: false,}
    //   }),
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

/*TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    switch (process.env.USE_DATABASE){
      case 'RawSql':
        return configService.get<TypeOrmModuleOptions>('RawSqlHerokuConfig');
        break;
      case 'TypeOrm':
        return configService.get<TypeOrmModuleOptions>('TypeOrmHerokuConfig');
        break;
      default:
        return configService.get<TypeOrmModuleOptions>('TypeOrmHerokuConfig');
        break;
    }
  },
  inject: [ConfigService],
}),*/

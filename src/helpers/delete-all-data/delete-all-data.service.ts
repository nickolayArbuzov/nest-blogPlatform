import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogModel } from '../../shared/collections/Blog/blogger.interface';
import { PostModel } from '../../features/posts/domain/entitites/post.interface';
import { CommentModel } from '../../features/comments/domain/entitites/comments.interface';
import { UserModel } from '../../features/sa/sa-users/domain/entitites/user.interface';
import { DeviceModel } from '../../features/devices/domain/entitites/device.interface';
import { LikeModel } from '../../features/likes/domain/entitites/like.interface';
import { LoggerModel } from '../logger/domain/entitites/logger.interface';
import { BloggerUserModel } from '../../features/blogger/blogger-user/domain/entitites/blogger-user.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AllDataService {
  constructor(
    @Inject('BLOG_MONGOOSE')
    private Blog: Model<BlogModel>,
    @Inject('POST_MONGOOSE')
    private Post: Model<PostModel>,
    @Inject('COMMENT_MONGOOSE')
    private Comment: Model<CommentModel>,
    @Inject('USER_MONGOOSE')
    private User: Model<UserModel>,
    @Inject('DEVICE_MONGOOSE')
    private Device: Model<DeviceModel>,
    @Inject('LIKE_MONGOOSE')
    private Like: Model<LikeModel>,
    @Inject('LOGGER_MONGOOSE')
    private Logger: Model<LoggerModel>,
    @Inject('BLOGGER-USER_MONGOOSE')
    private BloggerUser: Model<BloggerUserModel>,
    @InjectDataSource() private readonly db: DataSource,
  ) {}

  async deleteAllData(): Promise<void> {
    await this.Blog.deleteMany()
    await this.Post.deleteMany()
    await this.Comment.deleteMany()
    await this.User.deleteMany()
    await this.Device.deleteMany()
    await this.Like.deleteMany()
    await this.BloggerUser.deleteMany()
    await this.db.query(`
      delete from users;
      delete from devices;
    `);
  }
  
}
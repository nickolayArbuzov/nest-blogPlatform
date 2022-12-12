import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogModel } from '../../features/blogs/domain/entitites/blog.interface';
import { PostModel } from '../../features/posts/domain/entitites/post.interface';
import { CommentModel } from '../../features/comments/domain/entitites/comments.interface';
import { UserModel } from '../../features/sa/sa-users/domain/entitites/user.interface';
import { DeviceModel } from '../../features/devices/domain/entitites/device.interface';
import { LikeModel } from '../../features/likes/domain/entitites/like.interface';
import { LoggerModel } from '../logger/domain/entitites/logger.interface';

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
  ) {}

  async deleteAllData(): Promise<void> {
    await this.Blog.deleteMany()
    await this.Post.deleteMany()
    await this.Comment.deleteMany()
    await this.User.deleteMany()
    await this.Device.deleteMany()
    await this.Like.deleteMany()
  }
  
}
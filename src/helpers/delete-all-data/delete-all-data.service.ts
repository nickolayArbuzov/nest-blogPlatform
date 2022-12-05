import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlogModel } from '../../features/blogs/domain/entitites/blog.interface';
import { PostModel } from '../../features/posts/domain/entitites/post.interface';
import { CommentModel } from '../../features/comments/domain/entitites/comments.interface';
import { UserModel } from '../../features/users/domain/entitites/user.interface';

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
  ) {}

  async deleteAllData(): Promise<void> {
    await this.Blog.deleteMany()
    await this.Post.deleteMany()
    await this.Comment.deleteMany()
    await this.User.deleteMany()
  }
  
}
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { blogsProviders } from 'src/shared/collections/Blog/blog.providers';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { BloggerUserModel } from '../domain/entitites/blogger-user.interface';

@Injectable()
export class BloggerUserMongoose {
  constructor(
    @Inject('BLOGGER-USER_MONGOOSE')
    private BloggerUser: Model<BloggerUserModel>,
  ) {}

  async banUserById(userId: string, banUserBlogDto: BanUserBlogDto){
    if(banUserBlogDto.isBanned){
      const position = await this.BloggerUser.findOne({blogId: banUserBlogDto.blogId, bannedUserId: userId})
      if(position){
        return true
      } else {
        return await this.BloggerUser.create({blogId: banUserBlogDto.blogId, bannedUserId: userId})
      }
    } else {
      return await this.BloggerUser.deleteOne({blogId: banUserBlogDto.blogId, bannedUserId: userId})
    }
  }

  async findAllBannedUsersByBlogId(blogId: string){
    return await this.BloggerUser.find({blogId: blogId})
  }

}
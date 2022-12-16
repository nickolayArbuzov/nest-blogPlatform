import { Injectable } from '@nestjs/common';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { BloggerUserMongoose } from './blogger-user.repositoryMongoose';

@Injectable()
export class BloggerUserRepo {
  constructor(
    private bloggerUserMongoose: BloggerUserMongoose
  ) {}

  async banUserById(userId: string, banUserBlogDto: BanUserBlogDto){
    return await this.bloggerUserMongoose.banUserById(userId, banUserBlogDto)
  }

  async findAllBannedUsersByBlogId(blogId: string){
    return await this.bloggerUserMongoose.findAllBannedUsersByBlogId(blogId)
  }
}
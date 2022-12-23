import { Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { BloggerUserMongoose } from './blogger-user.repositoryMongoose';
import { BloggerUserSQL } from './blogger-user.repositorySQL';


@Injectable()
export class BloggerUserRepo {
  constructor(
    private bloggerUserRepo: BloggerUserSQL
  ) {}

  async banUserById(userId: string, banUserBlogDto: BanUserBlogDto){
    return await this.bloggerUserRepo.banUserById(userId, banUserBlogDto)
  }

  async findAllBannedUsersByBlogId(query: QueryUserDto, blogId: string){
    return await this.bloggerUserRepo.findAllBannedUsersByBlogId(query, blogId)
  }

  async findBannedPosition(blogId: string, userId: string){
    return await this.bloggerUserRepo.findBannedPosition(blogId, userId)
  }
}
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserModel } from '../../../sa/sa-users/domain/entitites/user.interface';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';
import { BloggerUserModel } from '../domain/entitites/blogger-user.interface';

@Injectable()
export class BloggerUserMongoose {
  constructor(
    @Inject('BLOGGER-USER_MONGOOSE')
    private BloggerUser: Model<BloggerUserModel>,
    @Inject('USER_MONGOOSE')
    private User: Model<UserModel>,
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

  async findAllBannedUsersByBlogId(query: QueryUserDto, blogId: string){
    const bannedUsers = await this.BloggerUser.find({blogId: blogId})
    const users = await this.User.find(
      {$and: 
        [
          {_id: {$in: bannedUsers.map(bu => bu.bannedUserId)}}, 
          {$or: 
            [
              {"login": {$regex: query.searchLoginTerm, $options: 'i'}}, 
              {"email": {$regex: query.searchEmailTerm, $options: 'i'}}
            ]
          }
        ]
      }
    )
    .skip((+query.pageNumber - 1) * +query.pageSize)
    .limit(+query.pageSize)
    .sort({[query.sortBy] : query.sortDirection})
   
    const totalCount = await this.User.countDocuments(
      {$and: 
        [
          {_id: {$in: bannedUsers.map(bu => bu.bannedUserId)}}, 
          {$or: 
            [
              {"login": {$regex: query.searchLoginTerm, $options: 'i'}}, 
              {"email": {$regex: query.searchEmailTerm, $options: 'i'}}
            ]
          }
        ]
      }
    )

    return {    
      pagesCount: Math.ceil(totalCount/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: totalCount,
      items: users.map(i => {
          return {
            id: i._id, 
            login: i.login, 
            banInfo: i.banInfo,
          }
      }),
  }
  }

}
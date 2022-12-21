import { Inject, Injectable } from '@nestjs/common';
import { QueryUserDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanUserBlogDto } from '../../../../shared/dto/ban.dto';

@Injectable()
export class BloggerUserSQL {
  constructor(
  ) {}

  async banUserById(userId: string, banUserBlogDto: BanUserBlogDto){
    return
  }

  async findAllBannedUsersByBlogId(query: QueryUserDto, blogId: string){
    return
  }

  async findBannedPosition(blogId: string, userId: string){
    return 
  }

}
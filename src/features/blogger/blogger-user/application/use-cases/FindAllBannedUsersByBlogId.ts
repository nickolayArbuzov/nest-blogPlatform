import { QueryHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BloggerUserRepo } from '../../infrastructure/blogger-user.repo';
import { QueryUserDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';
import { BloggerRepo } from '../../../../blogger/blogger-blog/infrastructure/blogger.repo';

export class FindAllBannedUsersByBlogIdQuery {
  constructor(
    public query: QueryUserDto,
    public blogId: string,
    public ownerId: string,
  ) {}
}

@QueryHandler(FindAllBannedUsersByBlogIdQuery)
export class FindAllBannedUsersByBlogIdUseCase {
  constructor(
    private bloggerUserRepo: BloggerUserRepo,
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(query: FindAllBannedUsersByBlogIdQuery){
    const blog = await this.bloggerRepo.findOneBlogById(query.blogId)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(blog.blogOwnerInfo.userId !== query.ownerId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    const queryParams = {
      banStatus: query.query.banStatus || 'all',
      pageNumber: query.query.pageNumber || queryDefault.pageNumber,
      pageSize: query.query.pageSize || queryDefault.pageSize,
      sortBy: query.query.sortBy || queryDefault.sortBy,
      sortDirection: query.query.sortDirection === 'asc' ? query.query.sortDirection : queryDefault.sortDirection,
      searchEmailTerm: query.query.searchEmailTerm || '',
      searchLoginTerm: query.query.searchLoginTerm || '',
    }
    return await this.bloggerUserRepo.findAllBannedUsersByBlogId(queryParams, query.blogId)
  }
}
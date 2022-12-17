import { QueryHandler } from '@nestjs/cqrs';
import { BloggerUserRepo } from '../../infrastructure/blogger-user.repo';
import { QueryUserDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';

export class FindAllBannedUsersByBlogIdQuery {
  constructor(
    public query: QueryUserDto,
    public blogId: string,
  ) {}
}

@QueryHandler(FindAllBannedUsersByBlogIdQuery)
export class FindAllBannedUsersByBlogIdUseCase {
  constructor(
    private bloggerUserRepo: BloggerUserRepo,
  ) {}

  async execute(query: FindAllBannedUsersByBlogIdQuery){
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
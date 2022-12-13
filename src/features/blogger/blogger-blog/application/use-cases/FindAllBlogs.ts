import { QueryHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { QueryBlogDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';

export class FindAllBlogsQuery {
  constructor(
    public queryParams: QueryBlogDto,
    public userId: string,
  ) {}
}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(query: FindAllBlogsQuery){
    const queryParams = {
      pageNumber: query.queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: query.queryParams.pageSize || queryDefault.pageSize,
      sortBy: query.queryParams.sortBy || queryDefault.sortBy,
      sortDirection: query.queryParams.sortDirection === 'asc' ? query.queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: query.queryParams.searchNameTerm || ''
    }
    return await this.bloggerRepo.findAllBlogs(queryParams, query.userId)
  }
}
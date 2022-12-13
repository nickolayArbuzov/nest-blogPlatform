import { QueryHandler } from '@nestjs/cqrs';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class FindAllBlogsQuery {
  constructor(
    public queryParams: QueryBlogDto,
  ) {}
}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(query: FindAllBlogsQuery){
    const queryParams = {
      pageNumber: query.queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: query.queryParams.pageSize || queryDefault.pageSize,
      sortBy: query.queryParams.sortBy || queryDefault.sortBy,
      sortDirection: query.queryParams.sortDirection === 'asc' ? query.queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: query.queryParams.searchNameTerm || ''
    }
    return await this.blogsRepo.findAllBlogs(queryParams)
  }
}
import { QueryHandler } from '@nestjs/cqrs';
import { queryDefault } from '../../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../../helpers/constants/commonDTO/query.dto';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class FindAllBlogsQuery {
  constructor(
    public query: QueryBlogDto,
  ) {}
}

@QueryHandler(FindAllBlogsQuery)
export class FindAllBlogsUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(query: FindAllBlogsQuery){
    const queryParams = {
      pageNumber: query.query.pageNumber || queryDefault.pageNumber,
      pageSize: query.query.pageSize || queryDefault.pageSize,
      sortBy: query.query.sortBy || queryDefault.sortBy,
      sortDirection: query.query.sortDirection === 'asc' ? query.query.sortDirection : queryDefault.sortDirection,
      searchNameTerm: query.query.searchNameTerm || ''
    }
    return await this.blogsRepo.findAllBlogs(queryParams)
  }
}
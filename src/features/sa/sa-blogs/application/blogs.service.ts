import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { PostsRepo } from '../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async bindBlogWithUser(id: string, userId: string){
    return 
  }

  async findAllBlogs(queryParams: QueryBlogDto){
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: queryParams.searchNameTerm || ''
    }
    return await this.blogsRepo.findAllBlogs(query)
  }
}
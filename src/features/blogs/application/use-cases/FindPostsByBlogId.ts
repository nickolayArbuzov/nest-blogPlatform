import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';
import { PostsRepo } from '../../../posts/infrastructure/posts.repo';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class FindPostsByBlogIdQuery {
  constructor(
    public queryParams: QueryBlogDto,
    public id: string,
    public userId: string,
  ) {}
}

@QueryHandler(FindPostsByBlogIdQuery)
export class FindPostsByBlogIdUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(query: FindPostsByBlogIdQuery){
    const blog = await this.blogsRepo.findOneBlogById(query.id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    const queryParams = {
      pageNumber: query.queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: query.queryParams.pageSize || queryDefault.pageSize,
      sortBy: query.queryParams.sortBy || queryDefault.sortBy,
      sortDirection: query.queryParams.sortDirection === 'asc' ? query.queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: query.queryParams.searchNameTerm || ''
    }
    const posts = await this.postsRepo.findAllPosts(queryParams, query.id)
    const items = []
    for await (const p of posts.items) {
      const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(p.id.toString(), query.userId)
      items.push({
          id: p.id,
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: extendedLikesInfo,
      })
    }
    return {...posts, items: items}
  }
}
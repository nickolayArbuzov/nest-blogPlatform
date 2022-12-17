import { QueryHandler } from '@nestjs/cqrs';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';

import { PostsRepo } from '../../infrastructure/posts.repo';

export class FindAllPostsQuery {
  constructor(
    public queryParams: QueryBlogDto, 
    public userId: string,
  ) {}
}

@QueryHandler(FindAllPostsQuery)
export class FindAllPostsUseCase {
  constructor(
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

    async execute(query: FindAllPostsQuery){
      const queryParams = {
        pageNumber: query.queryParams.pageNumber || queryDefault.pageNumber,
        pageSize: query.queryParams.pageSize || queryDefault.pageSize,
        sortBy: query.queryParams.sortBy || queryDefault.sortBy,
        sortDirection: query.queryParams.sortDirection === 'asc' ? query.queryParams.sortDirection : queryDefault.sortDirection,
      }
      const posts = await this.postsRepo.findAllPosts(queryParams)
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
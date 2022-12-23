import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { PostsRepo } from '../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../likes/infrastructure/like.repo';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepo: BlogsRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async findPostsByBlogId(queryParams: QueryBlogDto, id: string, userId: string){
    const blog = await this.blogsRepo.findOneBlogById(id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    const query = {
      pageNumber: queryParams.pageNumber || queryDefault.pageNumber,
      pageSize: queryParams.pageSize || queryDefault.pageSize,
      sortBy: queryParams.sortBy || queryDefault.sortBy,
      sortDirection: queryParams.sortDirection === 'asc' ? queryParams.sortDirection : queryDefault.sortDirection,
      searchNameTerm: queryParams.searchNameTerm || ''
    }
    const posts = await this.postsRepo.findAllPosts(query, id)
    const items = []
    for await (const p of posts.items) {
      const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(p.id.toString(), userId)
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

  async findOneBlogById(id: string){
    const blog = await this.blogsRepo.findOneBlogById(id)
    if(blog){
      return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      }
    }
    else {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
  }

}
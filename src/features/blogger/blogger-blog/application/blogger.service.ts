import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { queryDefault } from '../../../../helpers/constants/constants/constants';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BloggerRepo } from '../infrastructure/blogger.repo';
import { CreatePostDefaultDto } from '../../../posts/dto/post.dto';
import { PostsRepo } from '../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';

@Injectable()
export class BloggerService {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async findPostsByBlogId(queryParams: QueryBlogDto, id: string, userId: string){
    const blog = await this.bloggerRepo.findOneBlogById(id)
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

  async createOnePostForBlogId(id: string, newPost: CreatePostDefaultDto){
    const blog = await this.bloggerRepo.findOneBlogById(id)
    if(!blog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    const date = new Date()
    const post = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: id,
      blogName: id,
      createdAt: date.toISOString(),
    }

    const createdPost = await this.postsRepo.createOnePost(post)

    return {
      id: createdPost._id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [],
      }
    }
  }

  async findOneBlogById(id: string){
    const blog = await this.bloggerRepo.findOneBlogById(id)
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
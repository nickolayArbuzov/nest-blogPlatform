import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../../blogs/infrastructure/blogs.repo';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class FindOnePostByIdQuery {
  constructor(
    public id: string, 
    public userId: string, 
  ) {}
}

@QueryHandler(FindOnePostByIdQuery)
export class FindOnePostByIdUseCase {
  constructor(
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
    private blogsRepo: BlogsRepo,
  ) {}

    async execute(query: FindOnePostByIdQuery){
      const post = await this.postsRepo.findOnePostById(query.id)
      if(post){
        const blog = await this.blogsRepo.findOneBlogById(post.blogId.toString())
        if(blog && !blog.banInfo.isBanned) {
          const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(query.id, query.userId)
          return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: extendedLikesInfo
          }
        }
        else {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
      }
      else {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
    }
}
import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class FindOneBlogByIdQuery {
  constructor(
    public id: string,
  ) {}
}

@QueryHandler(FindOneBlogByIdQuery)
export class FindOneBlogByIdUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(query: FindOneBlogByIdQuery){
    const blog = await this.blogsRepo.findOneBlogById(query.id)
    if(blog && !blog.banInfo.isBanned){
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
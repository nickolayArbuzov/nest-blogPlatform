import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsMongoose } from './blogs.repositoryMongoose';
import { BlogsSQL } from './blogs.repositorySQL';

@Injectable()
export class BlogsRepo {
  constructor(
    private blogsRepo: BlogsSQL
  ) {}

  async findAllBlogs(query: QueryBlogDto){
    return await this.blogsRepo.findAllBlogs(query)
  }

  async findOneBlogById(id: string){
    return await this.blogsRepo.findOneBlogById(id)
  }

  async findOneBlogWithUserId(id: string){
    const blog = await this.blogsRepo.findOneBlogById(id)
    
    return {
      blogId: blog._id,
      blogOwnerInfo: blog.blogOwnerInfo,
    }
  }

}
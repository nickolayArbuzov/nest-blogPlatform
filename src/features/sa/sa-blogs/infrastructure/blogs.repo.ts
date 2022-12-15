import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanBlogInfo, Blog } from '../../../../shared/collections/Blog/blogger';
import { UpdateBlogDto } from '../dto/blog.dto';
import { BlogsMongoose } from './blogs.repositoryMongoose';

@Injectable()
export class BlogsRepo {
  constructor(private blogsMongoose: BlogsMongoose) {}

  async banOneBlogById(blogId: string, banInfo: BanBlogInfo){
    return await this.blogsMongoose.banOneBlogById(blogId, banInfo)
  }

  async findAllBlogs(query: QueryBlogDto){
    return await this.blogsMongoose.findAllBlogs(query)
  }

  async createOneBlog(newBlog: Blog){
    return await this.blogsMongoose.createOneBlog(newBlog)
  }

  async findOneBlogById(id: string){
    return await this.blogsMongoose.findOneBlogById(id)
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    return await this.blogsMongoose.updateOneBlogById(id, updateBlog)
  }

  async deleteOneBlogById(id: string){
    return await this.blogsMongoose.deleteOneBlogById(id)
  }
}
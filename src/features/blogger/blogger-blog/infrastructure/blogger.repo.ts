import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { Blog } from '../domain/entitites/blogger';
import { UpdateBlogDto } from '../dto/blogger.dto';
import { BloggerMongoose } from './blogger.repositoryMongoose';

@Injectable()
export class BloggerRepo {
  constructor(private bloggerMongoose: BloggerMongoose) {}

  async findAllBlogs(query: QueryBlogDto){
    return await this.bloggerMongoose.findAllBlogs(query)
  }

  async createOneBlog(newBlog: Blog){
    return await this.bloggerMongoose.createOneBlog(newBlog)
  }

  async findOneBlogById(id: string){
    return await this.bloggerMongoose.findOneBlogById(id)
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    return await this.bloggerMongoose.updateOneBlogById(id, updateBlog)
  }

  async deleteOneBlogById(id: string){
    return await this.bloggerMongoose.deleteOneBlogById(id)
  }
}
import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { Blog } from '../../../../shared/collections/Blog/blogger';
import { UpdateBlogDto } from '../dto/blogger.dto';
import { BloggerMongoose } from './blogger.repositoryMongoose';
import { BloggerSQL } from './blogger.repositorySQL';

@Injectable()
export class BloggerRepo {
  constructor(private bloggerRepo: BloggerSQL) {}

  async findAllBlogs(query: QueryBlogDto, userId: string){
    return await this.bloggerRepo.findAllBlogs(query, userId)
  }

  async createOneBlog(newBlog: Blog){
    return await this.bloggerRepo.createOneBlog(newBlog)
  }

  async findOneBlogById(id: string){
    return await this.bloggerRepo.findOneBlogById(id)
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    return await this.bloggerRepo.updateOneBlogById(id, updateBlog)
  }

  async deleteOneBlogById(id: string){
    return await this.bloggerRepo.deleteOneBlogById(id)
  }
}
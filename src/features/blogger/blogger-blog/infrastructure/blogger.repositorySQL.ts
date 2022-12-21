import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { Blog } from '../../../../shared/collections/Blog/blogger';
import { UpdateBlogDto } from '../dto/blogger.dto';

@Injectable()
export class BloggerSQL {
  constructor(
  ) {}

  async findAllBlogs(query: QueryBlogDto, userId: string){
    return
  }

  async createOneBlog(newBlog: Blog){
    return
  }

  async findOneBlogById(id: string){
    return
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    return
  }

  async deleteOneBlogById(id: string){
    return
  }
}
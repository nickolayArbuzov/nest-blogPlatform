import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { BanBlogInfo, Blog } from '../../../../shared/collections/Blog/blogger';
import { UpdateBlogDto } from '../dto/blog.dto';

@Injectable()
export class BlogsSQL {
  constructor(
  ) {}

  async banOneBlogById(blogId: string, banInfo: BanBlogInfo){
    return
  }

  async findAllBlogs(query: QueryBlogDto){
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
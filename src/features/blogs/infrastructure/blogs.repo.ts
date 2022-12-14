import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogsMongoose } from './blogs.repositoryMongoose';

@Injectable()
export class BlogsRepo {
  constructor(
    private blogsMongoose: BlogsMongoose
  ) {}

  async findAllBlogs(query: QueryBlogDto){
    return await this.blogsMongoose.findAllBlogs(query)
  }

  async findOneBlogById(id: string){
    return await this.blogsMongoose.findOneBlogById(id)
  }

}
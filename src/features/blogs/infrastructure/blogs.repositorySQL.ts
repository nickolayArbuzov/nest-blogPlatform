import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';

@Injectable()
export class BlogsSQL {
  constructor(
  ) {}

  async findAllBlogs(query: QueryBlogDto){
    return
  }

  async findOneBlogById(id: string){
    return
  }


}
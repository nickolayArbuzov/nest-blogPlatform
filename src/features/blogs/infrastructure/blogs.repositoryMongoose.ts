import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { BlogModel } from '../../../shared/collections/Blog/blogger.interface';

@Injectable()
export class BlogsMongoose {
  constructor(
    @Inject('BLOG_MONGOOSE')
    private Blog: Model<BlogModel>,
  ) {}

  async findAllBlogs(query: QueryBlogDto){
    const blogs = await this.Blog
      .find({$and: [{"name": {$regex: query.searchNameTerm, $options : 'i'}}, {'banInfo.isBanned': false}]})
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize)
      .sort({[query.sortBy] : query.sortDirection})
    
    const totalCount = await this.Blog.countDocuments({"name": {$regex: query.searchNameTerm, $options : 'i'}});
    return {
      pagesCount: Math.ceil(totalCount/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: totalCount,
      items: blogs.map(i => {
        return {
          id: i._id, 
          name: i.name, 
          description: i.description,
          websiteUrl: i.websiteUrl,
          createdAt: i.createdAt,
        }
      }),
    }
  }

  async findOneBlogById(id: string){
    return await this.Blog.findOne({_id: id})
  }


}
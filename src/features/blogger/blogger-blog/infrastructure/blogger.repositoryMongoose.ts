import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryBlogDto } from '../../../../helpers/constants/commonDTO/query.dto';
import { Blog } from '../../../../shared/collections/Blog/blogger';
import { BlogModel } from '../../../../shared/collections/Blog/blogger.interface';
import { UpdateBlogDto } from '../dto/blogger.dto';

@Injectable()
export class BloggerMongoose {
  constructor(
    @Inject('BLOG_MONGOOSE')
    private Blog: Model<BlogModel>,
  ) {}

  async findAllBlogs(query: QueryBlogDto, userId: string){
    const blogs = await this.Blog
      .find({"name": {$regex: query.searchNameTerm, $options : 'i'}, "blogOwnerInfo.userId": userId})
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize)
      .sort({[query.sortBy] : query.sortDirection})
    
    const totalCount = await this.Blog.countDocuments({"name": {$regex: query.searchNameTerm, $options : 'i'}, "blogOwnerInfo.userId": userId});

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

  async createOneBlog(newBlog: Blog){
    return await this.Blog.create(newBlog)
  }

  async findOneBlogById(id: string){
    return await this.Blog.findOne({_id: id})
  }

  async updateOneBlogById(id: string, updateBlog: UpdateBlogDto){
    return await this.Blog.updateOne({_id: id}, {$set: updateBlog})
  }

  async deleteOneBlogById(id: string){
    return await this.Blog.deleteOne({_id: id})
  }
}
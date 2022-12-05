import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { Post } from '../domain/entitites/post';
import { PostModel } from '../domain/entitites/post.interface';
import { UpdatePostDto } from '../dto/post.dto';

@Injectable()
export class PostsMongoose {
  constructor(
    @Inject('POST_MONGOOSE')
    private Post: Model<PostModel>,
  ) {}

  async findAllPosts(query: QueryBlogDto, id: string){
    let filter = {}
    if(id){
      filter = {blogId: id}
    }

    const posts = await this.Post
      .find(filter)
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize)
      .sort({[query.sortBy] : query.sortDirection})
    
    const totalCount = await this.Post.countDocuments(filter);
    
    return {
      pagesCount: Math.ceil(totalCount/+query.pageSize),
      page: +query.pageNumber,
      pageSize: +query.pageSize,
      totalCount: totalCount,
      items: posts.map(i => {
        return {
          id: i._id, 
          title: i.title, 
          shortDescription: i.shortDescription,
          content: i.content,
          blogId: i.blogId,
          blogName: i.blogName,
          createdAt: i.createdAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None",
            newestLikes: [],
          }
        }
      }),
    }
  }

  async createOnePost(newPost: Post){
    return await this.Post.create(newPost)
  }

  async findOnePostById(id: string){
    return await this.Post.findOne({_id: id})
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDto){
    return await this.Post.updateOne({_id: id}, {$set: updatePost})
  }

  async deleteOnePostById(id: string){
    return await this.Post.deleteOne({_id: id})
  }
}
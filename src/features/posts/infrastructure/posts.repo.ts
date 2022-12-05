import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsMongoose } from './posts.repositoryMongo';
import { Post } from '../domain/entitites/post';
import { UpdatePostDto } from '../dto/post.dto';

@Injectable()
export class PostsRepo {
  constructor(private postsMongoose: PostsMongoose) {}

  /*async findCommentsByPostId(){
    return await this.postsMongoose.findCommentsByPostId()
  }*/

  async findAllPosts(query: QueryBlogDto, id = ''){
    return await this.postsMongoose.findAllPosts(query, id)
  }

  async createOnePost(newPost: Post){
    return await this.postsMongoose.createOnePost(newPost)
  }

  async findOnePostById(id: string){
    return await this.postsMongoose.findOnePostById(id)
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDto){
    return await this.postsMongoose.updateOnePostById(id, updatePost)
  }

  async deleteOnePostById(id: string){
    return await this.postsMongoose.deleteOnePostById(id)
  }
}
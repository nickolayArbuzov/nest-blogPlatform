import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { PostsMongoose } from './posts.repositoryMongo';
import { Post } from '../domain/entitites/post';
import { UpdatePostDefaultDto } from '../dto/post.dto';
import { PostsSQL } from './posts.repositorySQL';

@Injectable()
export class PostsRepo {
  constructor(
    private postsRepo: PostsSQL,
  ) {}

  async findAllPosts(query: QueryBlogDto, id = ''){
    return await this.postsRepo.findAllPosts(query, id)
  }

  async createOnePost(newPost: Post){
    return await this.postsRepo.createOnePost(newPost)
  }

  async findOnePostById(id: string){
    return await this.postsRepo.findOnePostById(id)
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDefaultDto){
    return await this.postsRepo.updateOnePostById(id, updatePost)
  }

  async deleteOnePostById(id: string){
    return await this.postsRepo.deleteOnePostById(id)
  }
}
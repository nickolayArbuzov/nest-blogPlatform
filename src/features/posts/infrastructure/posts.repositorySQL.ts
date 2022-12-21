import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { Post } from '../domain/entitites/post';
import { UpdatePostDefaultDto } from '../dto/post.dto';

@Injectable()
export class PostsSQL {
  constructor(
  ) {}

  async findAllPosts(query: QueryBlogDto, id: string){
    return
  }

  async createOnePost(newPost: Post){
    return
  }

  async findOnePostById(id: string){
    return
  }

  async updateOnePostById(id: string, updatePost: UpdatePostDefaultDto){
    return
  }

  async deleteOnePostById(id: string){
    return
  }
}
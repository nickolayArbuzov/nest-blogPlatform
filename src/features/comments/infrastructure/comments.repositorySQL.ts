import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { Comment } from '../domain/entitites/comments'
import { UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentsSQL {
  constructor(
  ) {}

  async findAllCommentByPostId(postId: string, query: QueryBlogDto){
    return
  }

  async updateOneCommentById(commentId: string, updateComment: UpdateCommentDto){
    return 
  }

  async deleteOneCommentById(commentId: string){
    return 
  }

  async findOneCommentById(commentId: string){
    return 
  }

  async createCommentFromPost(newComment: Comment){
    return 
  }

  async findCommentsByBloggerId(query: QueryBlogDto, bloggerId: string){
    return
  }

}
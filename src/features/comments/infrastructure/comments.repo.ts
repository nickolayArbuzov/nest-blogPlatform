import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CommentsMongoose } from './comments.repositoryMongo';
import { Comment } from '../domain/entitites/comments'
import { UpdateCommentDto } from '../dto/comment.dto';
import { CommentsSQL } from './comments.repositorySQL';

@Injectable()
export class CommentsRepo {
  constructor(
    private commentsRepo: CommentsSQL
  ) {}

  async findCommentsByPostId(postId: string, query: QueryBlogDto){
    return await this.commentsRepo.findAllCommentByPostId(postId, query)
  }

  async updateOneCommentById(commentId: string, updateComment: UpdateCommentDto){
    return await this.commentsRepo.updateOneCommentById(commentId, updateComment)
  }

  async deleteOneCommentById(commentId: string){
    return await this.commentsRepo.deleteOneCommentById(commentId)
  }

  async findOneCommentById(commentId: string){
    return await this.commentsRepo.findOneCommentById(commentId)
  }

  async createCommentFromPost(newComment: Comment){
    return await this.commentsRepo.createCommentFromPost(newComment)
  }

  async findCommentsByBloggerId(queryParams: QueryBlogDto, bloggerId: string){
    return await this.commentsRepo.findCommentsByBloggerId(queryParams, bloggerId)
  }
}
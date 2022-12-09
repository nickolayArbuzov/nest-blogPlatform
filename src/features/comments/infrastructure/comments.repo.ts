import { Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CommentsMongoose } from './comments.repositoryMongo';
import { Comment } from '../domain/entitites/comments'
import { UpdateCommentDto } from '../dto/comment.dto';

@Injectable()
export class CommentsRepo {
  constructor(
    private commentsMongoose: CommentsMongoose
  ) {}

  async findCommentsByPostId(postId: string, query: QueryBlogDto){
    return await this.commentsMongoose.findAllCommentByPostId(postId, query)
  }

  async updateOneCommentById(commentId: string, updateComment: UpdateCommentDto){
    return await this.commentsMongoose.updateOneCommentById(commentId, updateComment)
  }

  async deleteOneCommentById(commentId: string){
    return await this.commentsMongoose.deleteOneCommentById(commentId)
  }

  async findOneCommentById(commentId: string){
    return await this.commentsMongoose.findOneCommentById(commentId)
  }

  async createCommentFromPost(newComment: Comment){
    return await this.commentsMongoose.createCommentFromPost(newComment)
  }
}
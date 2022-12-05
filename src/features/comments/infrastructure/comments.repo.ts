import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogDto } from '../../../helpers/constants/commonDTO/query.dto';
import { CommentsMongoose } from './comments.repositoryMongo';

@Injectable()
export class CommentsRepo {
  constructor(
    private commentsMongoose: CommentsMongoose
  ) {}

  async findCommentsByPostId(postId: string, query: QueryBlogDto){
    return await this.commentsMongoose.findAllCommentByPostId(postId, query)
  }
  async findOneCommentById(id: string){
    return await this.commentsMongoose.findOneCommentById(id)
  }
}
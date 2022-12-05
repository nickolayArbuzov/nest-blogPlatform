import { Inject, Injectable } from '@nestjs/common';
import { CommentsRepo } from '../infrastructure/comments.repo';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepo,
  ) {}
  async findOneCommentById(id: string){

  }
}
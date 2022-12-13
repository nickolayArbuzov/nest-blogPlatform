import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';
import { CommentsRepo } from '../../infrastructure/comments.repo';

export class FindOneCommentByIdQuery {
  constructor(
    public commentId: string,
    public userId = '',
  ) {}
}

@QueryHandler(FindOneCommentByIdQuery)
export class FindOneCommentByIdUseCase {
  constructor(
    private commentsRepo: CommentsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: FindOneCommentByIdQuery){
    const comment = await this.commentsRepo.findOneCommentById(command.commentId)
    if(comment) {
      const likesInfo = await this.likesRepo.getLikesInfoForComment(command.commentId, command.userId)
      return {
        ...comment,
        likesInfo: likesInfo,
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }
}
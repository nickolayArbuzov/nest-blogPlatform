import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { UsersRepo } from '../../../sa/sa-users/infrastructure/users.repo';
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
    private usersRepo: UsersRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: FindOneCommentByIdQuery){
    const comment = await this.commentsRepo.findOneCommentById(command.commentId)
    const user = await this.usersRepo.findOneUserById(comment?.userId.toString())
    if(!comment || user.banInfo.isBanned === true) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    } else {
      const likesInfo = await this.likesRepo.getLikesInfoForComment(command.commentId, command.userId)
      return {
        ...comment,
        likesInfo: likesInfo,
      }
    } 
  }
}
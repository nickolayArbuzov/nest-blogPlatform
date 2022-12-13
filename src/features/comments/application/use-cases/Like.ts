import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';
import { CommentsRepo } from '../../infrastructure/comments.repo';

export class LikeCommand {
  constructor(
    public commentId: string,
    public likeStatus: string,
    public user: {userId: string, userLogin: string},
  ) {}
}

@CommandHandler(LikeCommand)
export class LikeUseCase {
  constructor(
    private commentsRepo: CommentsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: LikeCommand){
    const comment = await this.commentsRepo.findOneCommentById(command.commentId)
    if (comment) {
        return await this.likesRepo.like(command.user, command.likeStatus, null, command.commentId)
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }
}
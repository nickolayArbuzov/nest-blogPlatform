import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommentsRepo } from '../../infrastructure/comments.repo';

export class DeleteOneCommentByIdCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOneCommentByIdCommand)
export class DeleteOneCommentByIdUseCase {
  constructor(
    private commentsRepo: CommentsRepo,
  ) {}

  async execute(command: DeleteOneCommentByIdCommand){
    const candidateComment = await this.commentsRepo.findOneCommentById(command.commentId)
    if (candidateComment) {
      if(candidateComment.userId !== command.userId){
        throw new HttpException('Not your comment', HttpStatus.FORBIDDEN)
      } else {
        await this.commentsRepo.deleteOneCommentById(command.commentId)
        return
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateCommentDto } from '../../dto/comment.dto';
import { CommentsRepo } from '../../infrastructure/comments.repo';

export class UpdateOneCommentByIdCommand {
  constructor(
    public commentId: string,
    public updateComment: UpdateCommentDto,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateOneCommentByIdCommand)
export class UpdateOneCommentByIdUseCase {
  constructor(
    private commentsRepo: CommentsRepo,
  ) {}

  async execute(command: UpdateOneCommentByIdCommand){
    const candidateComment = await this.commentsRepo.findOneCommentById(command.commentId)
    if (candidateComment) {
      if(candidateComment.userId !== command.userId){
        throw new HttpException('Not your comment', HttpStatus.FORBIDDEN)
      } else {
          await this.commentsRepo.updateOneCommentById(command.commentId, command.updateComment)
          return
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }
}
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LikesRepo } from '../../likes/infrastructure/like.repo';
import { UpdateCommentDto } from '../dto/comment.dto';
import { CommentsRepo } from '../infrastructure/comments.repo';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async like(commentId: string, likeStatus: string, user: {userId: string, userLogin: string}){
    const comment = await this.commentsRepo.findOneCommentById(commentId)
    if (comment) {
        return await this.likesRepo.like(user, likeStatus, null, commentId)
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }

  async updateOneCommentById(commentId: string, updateComment: UpdateCommentDto, userId: string){
    const candidateComment = await this.commentsRepo.findOneCommentById(commentId)
    if (candidateComment) {
      if(candidateComment.userId !== userId){
        throw new HttpException('Not your comment', HttpStatus.FORBIDDEN)
      } else {
          await this.commentsRepo.updateOneCommentById(commentId, updateComment)
          return
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }

  async deleteOneCommentById(commentId: string, userId: string){
    const candidateComment = await this.commentsRepo.findOneCommentById(commentId)
    if (candidateComment) {
      if(candidateComment.userId !== userId){
        throw new HttpException('Not your comment', HttpStatus.FORBIDDEN)
      } else {
          await this.commentsRepo.deleteOneCommentById(commentId)
          return
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }

  async findOneCommentById(commentId: string, userId = ''){
    const comment = await this.commentsRepo.findOneCommentById(commentId)
    if(comment) {
      const likesInfo = await this.likesRepo.getLikesInfoForComment(commentId, userId)
      return {
          ...comment,
          likesInfo: likesInfo,
      }
    } else {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
    }
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../../comments/dto/comment.dto';
import { CommentsRepo } from '../../../comments/infrastructure/comments.repo';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class CreateOneCommentByPostIdCommand {
  constructor(
    public postId: string, 
    public newComment: CreateCommentDto, 
    public userId: string,
  ) {}
}

@CommandHandler(CreateOneCommentByPostIdCommand)
export class CreateOneCommentByPostIdUseCase {
  constructor(
    private postsRepo: PostsRepo,
    private commentsRepo: CommentsRepo,
  ) {}

    async execute(command: CreateOneCommentByPostIdCommand){
      const post = await this.postsRepo.findOnePostById(command.postId)
      if(!post){
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
      const date = new Date()
      const comment = {
        content: command.newComment.content,
        userId: command.userId,
        userLogin: command.userId,
        postId: command.postId,
        createdAt: date.toISOString(),
      }
    
      const createdComment = await this.commentsRepo.createCommentFromPost(comment)
      
      return {
        id: createdComment._id,
        content: createdComment.content,
        userId: createdComment.userId,
        userLogin: createdComment.userLogin,
        createdAt: createdComment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
        },
      }
    }
}
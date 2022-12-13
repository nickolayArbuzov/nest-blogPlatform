import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LikesRepo } from '../../../likes/infrastructure/like.repo';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class LikeCommand {
  constructor(
    public postId: string, 
    public likeStatus: string, 
    public user: {userId: string, userLogin: string},
  ) {}
}

@CommandHandler(LikeCommand)
export class LikeUseCase {
  constructor(
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

    async execute(command: LikeCommand){
      const post = await this.postsRepo.findOnePostById(command.postId)
      if (post) {
          return await this.likesRepo.like(command.user, command.likeStatus, command.postId, null)
      } else {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      }
    }
}
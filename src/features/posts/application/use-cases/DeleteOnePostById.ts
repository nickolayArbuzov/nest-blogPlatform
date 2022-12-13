import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class DeleteOnePostByIdCommand {
  constructor(
    public id: string,
  ) {}
}

@CommandHandler(DeleteOnePostByIdCommand)
export class DeleteOnePostByIdUseCase {
  constructor(
    private postsRepo: PostsRepo,
  ) {}

  async execute(command: DeleteOnePostByIdCommand){
    const post = await this.postsRepo.deleteOnePostById(command.id)
    if(post.deletedCount === 0){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }
}
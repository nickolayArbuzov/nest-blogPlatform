import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../../dto/post.dto';
import { PostsRepo } from '../../infrastructure/posts.repo';

export class UpdateOnePostByIdCommand {
  constructor(
    public id: string,
    public updatePost: UpdatePostDto,
  ) {}
}

@CommandHandler(UpdateOnePostByIdCommand)
export class UpdateOnePostByIdUseCase {
  constructor(
    private postsRepo: PostsRepo,
  ) {}

    async execute(command: UpdateOnePostByIdCommand){
      const post = await this.postsRepo.updateOnePostById(command.id, command.updatePost)
      if(post.matchedCount === 0){
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
      } else {
        return
      }
    }
}
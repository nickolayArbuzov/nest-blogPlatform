import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';

export class DeleteOneBlogByIdCommand {
  constructor(
    public id: string,
  ) {}
}

@CommandHandler(DeleteOneBlogByIdCommand)
export class DeleteOneBlogByIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: DeleteOneBlogByIdCommand){
    const blog = await this.bloggerRepo.deleteOneBlogById(command.id)
    if(blog.deletedCount === 0){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';

export class DeleteOneBlogByIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteOneBlogByIdCommand)
export class DeleteOneBlogByIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: DeleteOneBlogByIdCommand){
    const candidateBlog = await this.bloggerRepo.findOneBlogById(command.blogId)
    if(!candidateBlog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(candidateBlog.blogOwnerInfo.userId !== command.userId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    return await this.bloggerRepo.deleteOneBlogById(command.blogId)
  }
}
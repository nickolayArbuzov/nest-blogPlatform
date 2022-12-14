import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';
import { UpdateBlogDto } from '../../dto/blogger.dto';

export class UpdateOneBlogByIdCommand {
  constructor(
    public blogId: string,
    public updateBlog: UpdateBlogDto,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateOneBlogByIdCommand)
export class UpdateOneBlogByIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: UpdateOneBlogByIdCommand){
    const candidateBlog = await this.bloggerRepo.findOneBlogById(command.blogId)
    if(!candidateBlog){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
    if(candidateBlog.blogOwnerInfo.userId !== command.userId){
      throw new HttpException('Blog not your', HttpStatus.FORBIDDEN)
    }
    return await this.bloggerRepo.updateOneBlogById(command.blogId, command.updateBlog)
  }
}
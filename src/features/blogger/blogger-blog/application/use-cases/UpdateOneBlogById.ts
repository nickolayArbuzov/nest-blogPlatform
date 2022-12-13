import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';
import { UpdateBlogDto } from '../../dto/blogger.dto';

export class UpdateOneBlogByIdCommand {
  constructor(
    public id: string,
    public updateBlog: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateOneBlogByIdCommand)
export class UpdateOneBlogByIdUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: UpdateOneBlogByIdCommand){
    const blog = await this.bloggerRepo.updateOneBlogById(command.id, command.updateBlog)
    if(blog.matchedCount === 0){
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    } else {
      return
    }
  }
}
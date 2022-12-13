import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';

export class UpdateOnePostOverBlogCommand {
  constructor(
    public blogId: string,
  ) {}
}

@CommandHandler(UpdateOnePostOverBlogCommand)
export class UpdateOnePostOverBlogUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: UpdateOnePostOverBlogCommand){
    return 
  }
}
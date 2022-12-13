import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { PostsRepo } from '../../../../posts/infrastructure/posts.repo';
import { LikesRepo } from '../../../../likes/infrastructure/like.repo';
import { QueryBlogDto } from '../../../../../helpers/constants/commonDTO/query.dto';

export class DeleteOnePostOverBlogCommand {
  constructor(
    public blogId: string,
  ) {}
}

@CommandHandler(DeleteOnePostOverBlogCommand)
export class DeleteOnePostOverBlogUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
    private postsRepo: PostsRepo,
    private likesRepo: LikesRepo,
  ) {}

  async execute(command: DeleteOnePostOverBlogCommand){
    return 
  }
}
import { CommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class BindBlogWithUserCommand {
  constructor(
    blogId: string, 
    userId: string,
  ) {}
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(command: BindBlogWithUserCommand){
    return
  }
}
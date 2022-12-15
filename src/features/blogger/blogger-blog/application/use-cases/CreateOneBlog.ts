import { CommandHandler } from '@nestjs/cqrs';
import { BloggerRepo } from '../../infrastructure/blogger.repo';
import { CreateBlogDto } from '../../dto/blogger.dto';

export class CreateOneBlogCommand {
  constructor(
    public newBlog: CreateBlogDto,
    public user: {userId: string, userLogin: string},
  ) {}
}

@CommandHandler(CreateOneBlogCommand)
export class CreateOneBlogUseCase {
  constructor(
    private bloggerRepo: BloggerRepo,
  ) {}

  async execute(command: CreateOneBlogCommand){
    const date = new Date()
    const blog = {
      name: command.newBlog.name,
      description: command.newBlog.description,
      websiteUrl: command.newBlog.websiteUrl,
      createdAt: date.toISOString(),
      blogOwnerInfo: {
        userId: command.user.userId,
        userLogin: command.user.userLogin,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
      }
    }

    const createdBlog = await this.bloggerRepo.createOneBlog(blog)

    return {
      id: createdBlog._id,
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
    }
  }
}
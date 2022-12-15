import { CommandHandler } from '@nestjs/cqrs';
import { BanBlogDto } from '../../../../../shared/dto/ban.dto';
import { BlogsRepo } from '../../infrastructure/blogs.repo';

export class BanOneBlogByIdCommand {
  constructor(
    public blogId: string, 
    public banBlogDto: BanBlogDto
  ) {}
}

@CommandHandler(BanOneBlogByIdCommand)
export class BanOneBlogByIdUseCase {
  constructor(
    private blogsRepo: BlogsRepo,
  ) {}

  async execute(command: BanOneBlogByIdCommand){
    const date = new Date()
    const banInfo = {
      isBanned: command.banBlogDto.isBanned,
      banDate: command.banBlogDto.isBanned ? date.toISOString() : null,
    }
    return await this.blogsRepo.banOneBlogById(command.blogId, banInfo)
  }
}